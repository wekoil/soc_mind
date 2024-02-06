document.addEventListener('DOMContentLoaded', function() {
    const setTimeButton = document.getElementById('setTimeButton');
    const openFacebookButton = document.getElementById('openFacebookButton');
    const timeInput = document.getElementById('timeInput');
  
    setTimeButton.addEventListener('click', function() {
      const timeLimit = parseInt(timeInput.value);
  
      if (isNaN(timeLimit) || timeLimit <= 0) {
        alert('Please enter a valid time limit.');
        return;
      }
  
      chrome.storage.local.set({ timeLimit: timeLimit }, function() {
        alert(`Time limit set to ${timeLimit} minutes. You can now go to Facebook.`);
      });
    });
  
    openFacebookButton.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, { action: 'startTimer' });
      });
  
      window.close();
    });
  });
  