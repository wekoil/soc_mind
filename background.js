chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const { timeLimit } = message;

  if (timeLimit) {
    chrome.storage.local.set({ "timeLimit": timeLimit });
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // get chrome tab url
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!

    if (urlMatches(url) && !isTimeOn())
    {
      chrome.scripting.executeScript({
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
    return true;
});
  
}

function urlMatches(url)
{
  const socialMediaHosts = ['www.facebook.com', 'www.instagram.com'];
  return (url && socialMediaHosts.some(host => url.includes(host)));
}

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

