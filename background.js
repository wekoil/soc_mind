// background.js

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const blockedSites = ["facebook.com", "instagram.com"];
  if (changeInfo.status === "complete" && tab.url) {
    if (blockedSites.some(site => tab.url.includes(site))) {
      const access = await chrome.storage.local.get(`access_${tabId}`);
      if (!access[`access_${tabId}`]) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["content.js"]
        });
      }
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "start_timer") {
    const { duration, reason } = request;
    const tabId = sender.tab.id;
    chrome.alarms.create(`alarm_${tabId}`, { delayInMinutes: duration });
    chrome.storage.local.set({ [`access_${tabId}`]: true });
    sendResponse({ success: true });
  }
});

chrome.alarms.onAlarm.addListener(alarm => {
  const tabId = parseInt(alarm.name.replace("alarm_", ""));
  chrome.tabs.sendMessage(tabId, { type: "time_up" });
  chrome.storage.local.remove(`access_${tabId}`);
});
