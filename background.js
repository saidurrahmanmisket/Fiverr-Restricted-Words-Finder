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
chrome.action.onClicked.addListener((tab) => {
    // Inject the content script into the active tab
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id }, // Target the current tab
            files: ['content.js'], // The content script file to inject
        },
        () => {
            console.log('Content script injected!');
        }
    );
});
