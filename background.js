chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "updateBadge") {
      const count = message.count;
      // Update the badge with the count
      chrome.action.setBadgeText({
        text: count > 0 ? String(count) : ""
      });
      chrome.action.setBadgeBackgroundColor({ color: count > 0 ? "red" : "green" });
    }
  });
  