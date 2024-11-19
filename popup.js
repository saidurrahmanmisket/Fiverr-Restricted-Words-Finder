document.addEventListener("DOMContentLoaded", () => {
  const restrictedWordsList = document.getElementById("restrictedWordsList");
  const replaceAllBtn = document.getElementById("replaceAllBtn");

  // Get the current tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getRestrictedWords" }, (response) => {
      if (response && response.words) {
        const words = response.words;

        // Populate the list
        restrictedWordsList.innerHTML = ""; // Clear previous list
        words.forEach((word) => {
          const wordItem = document.createElement("div");
          wordItem.textContent = word;
          wordItem.className = "restricted-word";

          // Remove word on click
          wordItem.addEventListener("click", () => {
            wordItem.remove(); // Remove from UI
            const index = words.indexOf(word);
            if (index > -1) {
              words.splice(index, 1); // Remove from array
            }
          });

          restrictedWordsList.appendChild(wordItem);
        });

        console.log("Restricted words list populated:", words); // Debugging log
      } else {
        console.error("No response or no words found."); // Debugging log
      }
    });
  });

  // Handle Replace All button click
  replaceAllBtn.addEventListener("click", () => {
    // Get the words currently in the list
    const words = Array.from(restrictedWordsList.querySelectorAll(".restricted-word"))
      .map((item) => item.textContent.trim());

    console.log("Words to Replace (Replace All clicked):", words); // Debugging log

    // Send the list of words to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "replaceAll", words: words },
        (response) => {
          console.log("Replace All Response:", response); // Debugging log
        }
      );
    });

    // Clear the list in the popup
    restrictedWordsList.innerHTML = "";
  });
});
