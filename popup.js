document.addEventListener('DOMContentLoaded', function () {
    const startTrackingBtn = document.getElementById('startTracking');
    const timeInput = document.getElementById('time');
  
    timeInput.addEventListener('input', function () {
      startTrackingBtn.disabled = timeInput.value <= 0;
    });
  
    startTrackingBtn.addEventListener('click', function () {
      const timeLimit = timeInput.value;
      const reason = document.getElementById('reason').value;
  
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { timeLimit, reason });
      });
  
      window.close();
    });
  });
  