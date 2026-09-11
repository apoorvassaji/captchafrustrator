// Characters to use for CAPTCHA (avoiding confusing chars like I, O, 0, 1)
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// DOM Elements
const captchaDisplay = document.getElementById("captcha-display");
const captchaInput = document.getElementById("captcha-input");
const submitBtn = document.getElementById("submit-btn");
const messageArea = document.getElementById("message-area");
const progressBar = document.getElementById("progress-bar");
const frustrationPercentageDisplay = document.getElementById("frustration-percentage");
const attemptCounterDisplay = document.getElementById("attempt-counter");
const achievementDisplay = document.getElementById("achievement");
const mainCard = document.querySelector(".card");

// State Variables
let currentCaptcha = "";
let frustrationLevel = 0;
let attempts = 0;
let isMaxFrustration = false;
let captchaInterval; // Store the interval so we can manage it if needed

// Funny Messages for when CAPTCHA changes
const changeMessages = [
    "😂 CAPTCHA changed! Try again!",
    "Too slow! 😈",
    "You almost had it!",
    "Nice typing. Unfortunately, the CAPTCHA disagrees.",
    "Did you really think it would be that easy? 😂",
    "CAPTCHA says NO.",
    "Your patience is being tested.",
    "Even a robot would give up."
];

// Funny Messages for incorrect submission
const failureMessages = [
    "❌ Wrong! Did you really think it would work? 😈",
    "❌ Nope. CAPTCHA wins again.",
    "😂 So close... maybe.",
    "❌ Your confidence was impressive.",
    "🤖 CAPTCHA: 1 | Human: 0"
];

// Generate a random 5-character string
function generateCaptcha() {
    let result = "";
    for (let i = 0; i < 5; i++) {
        result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
}

// Update the CAPTCHA display
function updateCaptcha() {
    currentCaptcha = generateCaptcha();
    captchaDisplay.textContent = currentCaptcha;

    // Add a small shake animation by toggling the class
    captchaDisplay.classList.remove("captcha-anim");
    void captchaDisplay.offsetWidth; // Trigger reflow to restart animation
    captchaDisplay.classList.add("captcha-anim");

    // If we haven't reached max frustration, increase it slightly and show a message
    if (!isMaxFrustration && frustrationLevel > 0) {
        // We check frustrationLevel > 0 so it doesn't show a message on the very first load
        increaseFrustration(5);
        showRandomMessage(changeMessages);
    }
}

// Show a random message from an array
function showRandomMessage(messageArray) {
    if (isMaxFrustration) return; // Don't override the max frustration message
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    messageArea.textContent = messageArray[randomIndex];
}

// Update Frustration Meter
function increaseFrustration(amount) {
    frustrationLevel += amount;

    // Cap at 100%
    if (frustrationLevel >= 100) {
        frustrationLevel = 100;
        triggerMaxFrustration();
    }

    // Update UI elements
    frustrationPercentageDisplay.textContent = frustrationLevel;
    progressBar.style.width = frustrationLevel + "%";
}

// Handle what happens at 100% frustration
function triggerMaxFrustration() {
    if (isMaxFrustration) return; // Prevent triggering multiple times
    isMaxFrustration = true;

    // Special messages and styles for maximum frustration
    messageArea.textContent = "💀 MAXIMUM FRUSTRATION ACHIEVED";
    messageArea.style.color = "#ef4444"; // Red color

    // Add crazy CSS animation to the main card
    mainCard.classList.add("max-frustration");

    // Update achievement
    achievementDisplay.textContent = "🏆 Achievement Unlocked: Professional CAPTCHA Sufferer";
}

// Handle Submit Button Click
function handleSubmit() {
    // Get user input and convert to uppercase to match CAPTCHA
    const userInput = captchaInput.value.trim().toUpperCase();

    // Don't do anything if empty
    if (!userInput) return;

    // Increase attempts
    attempts++;
    attemptCounterDisplay.textContent = attempts;

    if (userInput === currentCaptcha) {
        // Success case (extremely rare due to 3-second interval)
        messageArea.textContent = "😳 WAIT... YOU ACTUALLY GOT IT?!";
        messageArea.style.color = "#22c55e"; // Green color
        achievementDisplay.textContent = "🏆 Achievement Unlocked: CAPTCHA Survivor";

        // Stop the madness if they actually win
        clearInterval(captchaInterval);
        captchaDisplay.style.color = "#22c55e";
        captchaDisplay.style.borderColor = "#22c55e";
    } else {
        // Failure case
        if (!isMaxFrustration) {
            showRandomMessage(failureMessages);
        }
        increaseFrustration(10); // Penalty for getting it wrong

        // Evolve achievements based on attempts
        if (attempts === 5) {
            achievementDisplay.textContent = "🏆 Achievement Unlocked: Persistent Fool";
        } else if (attempts === 15) {
            achievementDisplay.textContent = "🏆 Achievement Unlocked: You Have Too Much Patience";
        } else if (attempts === 30) {
            achievementDisplay.textContent = "🏆 Achievement Unlocked: Please Just Stop";
        }
    }

    // Clear input field
    captchaInput.value = "";

    // Keep focus on input for better UX (and easier frustration)
    captchaInput.focus();
}

// Event Listeners
submitBtn.addEventListener("click", handleSubmit);

// Allow pressing "Enter" key to submit
captchaInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        handleSubmit();
    }
});

// Initialize Project
function init() {
    // Set initial CAPTCHA
    updateCaptcha();

    // THE CORE JOKE: Change CAPTCHA every 3 second (3000ms)
    captchaInterval = setInterval(updateCaptcha, 3000);
}

// Start everything when the page loads
window.onload = init;
