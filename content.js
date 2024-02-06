// chrome.tabs.onUpdated.addListener(
//   function () {

//       const userInput = prompt(`You are entering a social media site. Set a time limit:`, "");
  
//       if (userInput !== null) {
//         const enteredTime = parseInt(userInput);
//         if (!isNaN(enteredTime) && enteredTime > 0) {
//           setTimeout(function () {
//             alert(`Time limit (${timeLimit} minutes) on social media has passed.`);
//           }, enteredTime * 60 * 1000);
//         } else {
//           alert("Invalid time. Please set a valid time to continue tracking.");
//         }
//       }
//   });