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
  

// Function to count restricted words
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
  document.addEventListener("input", () => {
    const restrictedWordCount = countRestrictedWords();

    // Send the count to the background script
    chrome.runtime.sendMessage({
      type: "updateBadge",
      count: restrictedWordCount,
    });
  });
}

// Function to replace restricted words with a dash-separated version
function replaceRestrictedWords() {
  const inputs = document.querySelectorAll("textarea, input[type='text']");
  inputs.forEach((input) => {
    const text = input.value;
    const regex = new RegExp(`\\b(${restrictedWords.join("|")})\\b`, "gi");

    // Replace restricted words with dash-separated versions
    const replacedText = text.replace(regex, (match) => {
      return match.split("").join("-");
    });

    input.value = replacedText; // Update the input's value
  });
}

// Function to highlight restricted words
// function highlightRestrictedWords() {
//   const inputs = document.querySelectorAll("textarea, input[type='text']");
//   inputs.forEach((input) => {
//     const text = input.value;
//     const regex = new RegExp(`\\b(${restrictedWords.join("|")})\\b`, "gi");
//     const highlightedText = text.replace(regex, (match) => `[[${match}]]`);

//     // Temporarily show highlights in the input (highlighting in input fields is limited)
//     input.value = highlightedText;
//   });
// }


// Highlight restricted words using an overlay
function highlightRestrictedWords() {
    const inputs = document.querySelectorAll("textarea, input[type='text']");
  
    inputs.forEach((input) => {
      // Create a parent wrapper if not already present
      if (!input.parentElement.classList.contains("highlight-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "highlight-wrapper";
        wrapper.style.position = "relative";
        input.parentElement.insertBefore(wrapper, input);
        wrapper.appendChild(input);
      }
  
      // Create an overlay for the highlights
      let overlay = input.parentElement.querySelector(".highlight-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "highlight-overlay";
        overlay.style.position = "absolute";
        overlay.style.left = 0;
        overlay.style.top = '215px';         
        overlay.style.background = '#e8f1ff';
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "1";
        overlay.style.color = "transparent"; // Transparent to mimic input field
        overlay.style.whiteSpace = "pre-wrap"; // Preserve whitespace
        overlay.style.fontSize = window.getComputedStyle(input).fontSize;
        overlay.style.fontFamily = window.getComputedStyle(input).fontFamily;
        overlay.style.lineHeight = window.getComputedStyle(input).lineHeight;
        input.parentElement.appendChild(overlay);
      }
  
      // Get the input's current value
      const text = input.value;
  
      // Replace restricted words with highlighted spans
      const regex = new RegExp(`\\b(${restrictedWords.join("|")})\\b`, "gi");
      const highlightedText = text.replace(regex, (match) => {
        return `<span class="highlight">${match}</span>`;
      });
  
      // Update the overlay's content
      overlay.innerHTML = highlightedText;
  
      // Synchronize overlay position with input scrolling
      input.addEventListener("scroll", () => {
        overlay.style.transform = `translateY(${-input.scrollTop}px)`;
      });
    });
  }
  
  // Add a listener to monitor text inputs and highlight dynamically
  document.addEventListener("input", highlightRestrictedWords);
  


// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "replaceAll") {
    replaceRestrictedWords();
  }
});

// Initialize
monitorInputs();
highlightRestrictedWords();


document.addEventListener("click", () => {
    highlightRestrictedWords();
  });