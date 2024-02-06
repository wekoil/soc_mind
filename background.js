chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const { timeLimit, reason } = message;

  if (timeLimit && reason) {
    chrome.storage.local.set({ timeLimit, reason });
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  const socialMediaHosts = ['www.facebook.com', 'www.instagram.com'];
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!
    if (changeInfo.status === 'complete' && url && socialMediaHosts.some(host => url.includes(host))) {
      chrome.scripting.executeScript({
        target: { tabId },
        function: showInitialPrompt,
      });
    }
  });
  
});

function showInitialPrompt() {
  const userInput = prompt("You are entering a social media site. Set a time limit (minutes) and enter a reason:", "");

  if (userInput !== null) {
    const enteredTime = parseInt(userInput);
    if (!isNaN(enteredTime) && enteredTime > 0) {
      chrome.runtime.sendMessage({ timeLimit: enteredTime, reason: userInput });
    } else {
      alert("Invalid time. Please set a valid time to continue tracking.");
    }
  }
}

