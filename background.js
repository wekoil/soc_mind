chrome.runtime.onMessage.addListener(function (message, tabId, sender, sendResponse) {
  const { timeLimit } = message;
  const realTabId = tabId[0];

  if (timeLimit) {
    // var limitStamp = parseInt(Date.now()) + limitStamp * 60
    // chrome.storage.local.set({ "timeLimit": limitStamp });

    if (!isNaN(timeLimit) && timeLimit > 0) {
      setTimeout(function () {
        chrome.scripting.executeScript({
          target: { tabId: realTabId },
          function: showAlert,
        });
      }, timeLimit * 60 * 1000);
    }
  }
});

function showAlert(timeLimit)
{
  alert(`Time limit (${timeLimit} minutes) on social media has passed.`);
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // get chrome tab url
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!

    if (urlMatches(url) && !isTimeOn())
    {
      chrome.scripting.executeScript({
        args: [tabId],
        target: { tabId },
        function: showInitialPrompt,
      });
    }
  });
});

function isTimeOn()
{
  chrome.storage.local.get("timeLimit", function(items){
    var limit = items["timeLimit"];
    if (limit == null || limit == 0)
    {
      return false;
    }
    if (Date.now() >= limit)
    {
      return true;
    }
    return false;
});
  
}

function urlMatches(url)
{
  const socialMediaHosts = ['www.facebook.com', 'www.instagram.com'];
  return (url && socialMediaHosts.some(host => url.includes(host)));
}

function showInitialPrompt(tabId) {
  const userInput = prompt("You are entering a social media site. Set a time limit (minutes) and enter a reason:", "");

  if (userInput !== null) {
    const enteredTime = parseInt(userInput);
    if (!isNaN(enteredTime) && enteredTime > 0) {
      chrome.runtime.sendMessage({ timeLimit: enteredTime, tabId: tabId });
    } else {
      alert("Invalid time. Please set a valid time to continue tracking.");
    }
  }
}

