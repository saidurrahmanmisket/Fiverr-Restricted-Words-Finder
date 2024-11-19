// List of restricted words
const restrictedWords = [
    // Illegal Activities
    "illegal", "scam", "fraud", "hacking", "piracy", "drugs", "weapons",
  
    // Hate Speech and Discrimination
    "racist", "sexist", "homophobic", "hate", "discrimination", "prejudice",
  
    // Adult Content
    "adult", "explicit", "porn", "sex", "nudity",
  
    // Violence and Harm
    "violence", "harm", "abuse", "bullying", "threat", "murder", "kill",
  
    // Copyright Infringement
    "copyright", "plagiarism", "trademark", "patent", "infringement",
  
    // Personal Information and Privacy
    "phone", "email", "address", "contact", "phone number", "email address",
    "personal information", "privacy",
  
    // Academic Dishonesty
    "essay writing", "assignment", "homework", "academic", "cheating",
  
    // Spam and Misleading Information
    "spam", "fake", "misleading", "false advertising", "unethical",
  
    // Phishing and Malware
    "phishing", "malware", "virus", "trojan", "spyware", "ransomware",
  
    // Fiverr-Specific Restrictions
    "payment", "pay", "money", "outside of Fiverr", "review", "paypal",
    "bank account", "wire transfer", "credit card", "cash"
  ];
  

// // Function to count restricted words
function countRestrictedWords() {
  let count = 0;
  const inputs = document.querySelectorAll("textarea, input[type='text']");
  inputs.forEach((input) => {
    const text = input.value;
    const regex = new RegExp(`\\b(${restrictedWords.join("|")})\\b`, "gi");
    const matches = text.match(regex);
    if (matches) {
      count += matches.length;
    }
  });
  return count;
}

// Monitor for changes in text inputs
function monitorInputs() {
    const restrictedWordCount = countRestrictedWords();
    // Send the count to the background script
    chrome.runtime.sendMessage({
      type: "updateBadge",
      count: restrictedWordCount,
    });
  }
  document.addEventListener("input", () => {
    monitorInputs();
  });


function replaceRestrictedWords(wordsToReplace) {
  const inputs = document.querySelectorAll("textarea, input[type='text']");
  inputs.forEach((input) => {
    let text = input.value;

    // Replace only the words in the provided list
    wordsToReplace.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      text = text.replace(regex, (match) => match.split("").join("-"));
    });

    input.value = text; // Update the input field
  });

  console.log("Replaced Words with Dashes:", wordsToReplace); // Debugging log
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "replaceAll") {
    if (message.words && Array.isArray(message.words)) {
      replaceRestrictedWords(message.words);
      sendResponse({ success: true }); // Confirm action success
    } else {
      console.error("No words provided to replace.");
      sendResponse({ success: false });
    }
  }
});





// Function to find restricted words in input fields
function getRestrictedWords() {
  const wordsFound = [];
  const inputs = document.querySelectorAll("textarea, input[type='text']");
  inputs.forEach((input) => {
    const text = input.value;
    const regex = new RegExp(`\\b(${restrictedWords.join("|")})\\b`, "gi");
    const matches = text.match(regex);
    if (matches) {
      matches.forEach((word) => {
        if (!wordsFound.includes(word.toLowerCase())) {
          wordsFound.push(word.toLowerCase()); // Avoid duplicates
        }
      });
    }
  });
  return wordsFound;
}


// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getRestrictedWords") {
    // Return restricted words to the popup
    const words = getRestrictedWords();
    sendResponse({ words: words });
  }

  if (message.action === "replaceAll") {
    const wordsToReplace = message.words; // Words to be replaced
    const inputs = document.querySelectorAll("textarea, input[type='text']");

    inputs.forEach((input) => {
      let text = input.value;

      // Replace only the words in the provided list
      wordsToReplace.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        text = text.replace(regex, (match) => match.split("").join("-"));
      });

      input.value = text;
    });
  }
});



// Initialize
monitorInputs();

document.addEventListener("click", () => {
monitorInputs();
});


chrome.tabs.sendMessage(tabs[0].id, { action: "getRestrictedWords" }, (response) => {
  console.log("Restricted Words Response:", response); // Log response for debugging
  if (response && response.words) {
    const words = response.words;
    console.log("Words Found:", words); // Debugging log
  }
});


// Respond to "getRestrictedWords" action
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getRestrictedWords") {
    const words = getRestrictedWords();
    console.log("Restricted words sent to popup:", words); // Debugging log
    sendResponse({ words: words });
  }
});




console.log("replaceAll message received:", message.words);
