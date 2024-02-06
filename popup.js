document.addEventListener('DOMContentLoaded', function () {
    const startTrackingBtn = document.getElementById('startTracking');
    const resetTrackingBtn = document.getElementById('resetTracking');
    const timeInput = document.getElementById('time');
  
    timeInput.addEventListener('input', function () {
      startTrackingBtn.disabled = timeInput.value <= 0;
    });
  
    // startTrackingBtn.addEventListener('click', function () {
    //   const timeLimit = timeInput.value;
    //   const reason = document.getElementById('reason').value;
  
    //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, { timeLimit });
    //   });
  
    //   window.close();
    // });

    resetTrackingBtn.addEventListener('click', function () {
  
      chrome.storage.local.set({ "timeLimit": 0 });
  
      window.close();
    });
  });
  