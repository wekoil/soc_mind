// content.js

if (!document.getElementById("site-timer-overlay")) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "site-timer-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.zIndex = 9999;
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
  
    // Create popup content with more reasons
    const popup = document.createElement("div");
    popup.style.backgroundColor = "#fff";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.textAlign = "center";
    popup.innerHTML = `
      <h2>Why do you want to visit this site?</h2>
      <select id="reason">
        <option value="search_event">Search for an event</option>
        <option value="add_story">Add a story</option>
        <option value="check_messages">Check messages</option>
        <option value="browse_feed">Browse feed</option>
        <option value="post_update">Post an update</option>
        <option value="other">Other</option>
      </select>
      <h3>How long do you want to stay?</h3>
      <button data-duration="5">5 Minutes</button>
      <button data-duration="10">10 Minutes</button>
      <button data-duration="15">15 Minutes</button>
    `;
  
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  
    // Add event listeners to buttons
    const buttons = popup.querySelectorAll("button");
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const duration = parseInt(button.getAttribute("data-duration"));
        const reason = document.getElementById("reason").value;
        chrome.runtime.sendMessage(
          { type: "start_timer", duration, reason },
          response => {
            if (response.success) {
              overlay.remove();
            }
          }
        );
      });
    });
  }
  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "time_up") {
        const stayButton = document.createElement("button");
        stayButton.textContent = "Stay on this site";
        stayButton.addEventListener("click", () => {
            // Do nothing
        });

        const leaveButton = document.createElement("button");
        leaveButton.textContent = "Leave site";
        leaveButton.addEventListener("click", () => {
            window.close();
        });

        const text = document.createElement("p");
        text.textContent = "Your time is up. Do something productive now!!!";

        const popup = document.createElement("div");
        popup.style.backgroundColor = "#fff";
        popup.style.padding = "20px";
        popup.style.borderRadius = "8px";
        popup.style.textAlign = "center";
        popup.appendChild(text);
        popup.appendChild(stayButton);
        popup.appendChild(leaveButton);

        const overlay = document.createElement("div");
        overlay.id = "site-timer-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        overlay.style.zIndex = 9999;
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.appendChild(popup);

        document.body.appendChild(overlay);
    }
});
  