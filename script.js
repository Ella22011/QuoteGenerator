const apiUrls = [
    "https://qapi.vercel.app/api/random", // First API for quotes
    "https://quote-generator-api-six.vercel.app" // Second API for quotes
];

// Hardcoded quotes
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
    { text: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
    { text: "A life without love is like a year without spring.", author: "Octavian Paler" },
    { text: "Nature gives to every time and season some beauties of its own.", author: "Charles Dickens" },
    { text: "If we had no winter the spring would not be so pleasant.", author: "Anne Bradstreet" },
    { text: "I have learned over the years that when one's mind is made up, it diminishes fear.", author: "Rosa Parks" },
    { text: "Our lives begin to end the day we become silent about things that matter.", author: "Martin Luther King Jr." }
];

const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const randomImage = document.getElementById("random-image");

// Function to calculate the brightness of a color
function getBrightness(color) {
    color = color.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Function to generate a random background color
function getRandomColor(){
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to change background color and adjust text color
function changeBackgroundColor() {
    const backgroundColor = getRandomColor();
    document.body.style.background = backgroundColor;

    const brightness = getBrightness(backgroundColor);

    if (brightness > 128) {
        document.body.style.color = "#000";  // Dark text color for light background
    } else {
        document.body.style.color = "#FFF";  // White text color for dark background
    }
}

function generateRandomAnimalImage() {
    const useCat = Math.random() > 0.5;

    if (useCat) {
        // Cataas provides direct image URLs
        const catUrl = `https://cataas.com/cat?${new Date().getTime()}`; // Add cache buster
        randomImage.src = catUrl;

    } else {
        const dogApiUrl = "https://dog.ceo/api/breeds/image/random";
        fetch(dogApiUrl)
            .then(response => response.json())
            .then(data => {
                randomImage.src = data.message;
            })
            .catch(error => {
                console.error("Error fetching dog image:", error);
            });
    }
}

// Function to generate a quote (randomly from API or hardcoded list)
function generateQuote() {
    const source = Math.random() > 0.5 ? 'api' : 'hardcoded';  // 50% chance of API or hardcoded quote

    if (source === 'api') {
        const apiUrl = apiUrls[Math.floor(Math.random() * apiUrls.length)];
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                quoteText.textContent = `"${data.quote}"`;
                authorText.textContent = `- ${data.author || "Unknown"}`;
                changeBackgroundColor();
                generateRandomAnimalImage()
            })
            .catch(error => {
                console.error("Error fetching from API:", error);
                getHardcodedQuote(); // Fallback to hardcoded quote
                changeBackgroundColor();
                generateRandomAnimalImage()
            });
    } else {
        getHardcodedQuote();
        changeBackgroundColor();
        generateRandomAnimalImage()
    }
}

// Function to fetch a random quote from hardcoded list
function getHardcodedQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteText.textContent = `"${quote.text}"`;
    authorText.textContent = `- ${quote.author}`;
}

// Function to copy the current quote to clipboard
function copyQuote() {
    const textToCopy = `${quoteText.textContent} ${authorText.textContent}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showCopyMessage();  // Show confirmation message when copied
    }).catch(err => {
        console.error("Error copying text: ", err);
    });
}

// Function to display the "quote copied" message
function showCopyMessage() {
    const message = document.createElement('div');
    message.innerText = 'Quote copied to clipboard! 🐾';
    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.right = '20px';
    message.style.background = '#ff7eb3';
    message.style.color = '#fff';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '8px';
    message.style.fontSize = '14px';
    message.style.zIndex = '1000';
    message.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(message);

    // Remove message after 2 seconds
    setTimeout(() => {
        message.remove();
    }, 2000);
}

const buttons = document.querySelectorAll('button');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.remove('bling');
        void btn.offsetWidth;
        btn.classList.add('bling');
    });
});

// Event Listeners
newQuoteBtn.addEventListener("click", generateQuote);
copyQuoteBtn.addEventListener("click", copyQuote);

// Generate an initial quote when the page loads
generateQuote();
generateRandomAnimalImage();

