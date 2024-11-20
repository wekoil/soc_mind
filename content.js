// content.js

const reasons = {
  facebook: [
    "Browse feed",
    "Post an update",
    "Check notifications",
    "Chat with friends",
    "Other"
  ],
  youtube: [
    "Watch a video",
    "Upload a video",
    "Check subscriptions",
    "Browse trending",
    "Other"
  ],
  instagram: [
    "Browse feed",
    "Post a photo",
    "Check notifications",
    "Chat with friends",
    "Other"
  ],
  reddit: [
    "Browse subreddits",
    "Post a comment",
    "Check notifications",
    "Chat with users",
    "Other"
  ],
  default: [
    "General browsing",
    "Other"
  ]
};

function getReasonsForPage() {
  const url = window.location.hostname;
  if (url.includes("facebook.com")) {
    return reasons.facebook;
  } else if (url.includes("youtube.com")) {
    return reasons.youtube;
  } else if (url.includes("instagram.com")) {
    return reasons.instagram;
  } else if (url.includes("reddit.com")) {
    return reasons.reddit;
  } else {
    return reasons.default;
  }
}

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

  // Create popup content with reasons
  const popup = document.createElement("div");
  popup.style.backgroundColor = "#fff";
  popup.style.padding = "20px";
  popup.style.borderRadius = "8px";
  popup.style.textAlign = "center";
  popup.innerHTML = `
    <h2>Why do you want to visit this site?</h2>
    <select id="reason-select">
      ${getReasonsForPage().map(reason => `<option value="${reason}">${reason}</option>`).join('')}
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
      const reason = document.getElementById("reason-select").value;
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
      overlay.remove();
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