// Sample data
const captions = {
    happy: [
        "Living my best life! ✨",
        "Happiness is a choice, and I choose it every day! 😊",
        "Spreading smiles wherever I go! 🌟"
    ],
    sad: [
        "Some days are harder than others... 💭",
        "In the depths of silence... 🌧",
        "Finding strength in vulnerability 🤍"
    ],
    excited: [
        "Can't contain my excitement! 🎉",
        "Adventure awaits! 🌎",
        "Living for these moments! ⚡"
    ],
    romantic: [
        "Lost in your eyes 💕",
        "Forever kind of love 🌹",
        "My heart beats for you ❤️"
    ]
};

const trendingHashtags = [
    "#CaptionGenius",
    "#PhotoOfTheDay",
    "#Trending",
    "#Viral",
    "#Aesthetic",
    "#GoodVibes"
];

// Sound effects
const clickSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABhgC1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYY3hollah');

const COOLDOWN_TIME = 2000; // 2 seconds cooldown
const buttonStates = {
    generate: false,
    mood: false,
    voice: false
};

const AI_PROCESSING_TIME = 1500;
const TYPING_SPEED = 50;

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add these new constants after the existing ones
const captionTemplates = {
    happy: [
        "{starter} {feeling} {emoji}",
        "{time} {feeling} {action} {emoji}",
        "{starter} {action} {context} {emoji}"
    ],
    sad: [
        "{feeling} {context} {emoji}",
        "{time} {feeling} {reflection} {emoji}",
        "{starter} {feeling} {hope} {emoji}"
    ],
    excited: [
        "{exclamation} {feeling} {action} {emoji}",
        "{time} {feeling} {future} {emoji}",
        "{starter} {action} {context} {emoji}"
    ],
    romantic: [
        "{feeling} {love} {emoji}",
        "{time} {context} {love} {emoji}",
        "{starter} {feeling} {forever} {emoji}"
    ]
};

const wordBank = {
    starter: ["Today", "Right now", "In this moment", "Here", "Life is", "My soul is"],
    feeling: {
        happy: ["blessed", "grateful", "joyful", "radiant", "incredible", "wonderful"],
        sad: ["reflective", "healing", "growing", "learning", "accepting", "understanding"],
        excited: ["thrilled", "energized", "unstoppable", "inspired", "passionate", "amazed"],
        romantic: ["enchanted", "in love", "smitten", "captivated", "dreamy", "mesmerized"]
    },
    action: {
        happy: ["embracing life", "spreading joy", "creating memories", "shining bright"],
        sad: ["finding peace", "seeking strength", "embracing change", "moving forward"],
        excited: ["chasing dreams", "breaking limits", "reaching higher", "exploring life"],
        romantic: ["falling deeper", "loving endlessly", "cherishing moments", "dancing together"]
    },
    context: {
        happy: ["with gratitude", "in paradise", "with pure joy", "among blessings"],
        sad: ["in solitude", "through storms", "with hope", "despite challenges"],
        excited: ["on this journey", "in this adventure", "with passion", "through experiences"],
        romantic: ["in love's embrace", "in this romance", "with my soulmate", "in this story"]
    },
    time: ["Today", "This moment", "Right now", "Forever", "Always"],
    exclamation: ["Wow!", "Amazing!", "Incredible!", "Fantastic!"],
    reflection: ["but staying strong", "yet growing", "and learning", "with hope"],
    hope: ["better days ahead", "silver linings exist", "tomorrow is new", "hope prevails"],
    love: ["in love's symphony", "heart full of love", "love's pure magic", "eternal romance"],
    forever: ["forever and always", "timeless moments", "endless love", "infinite joy"],
    emoji: {
        happy: ["✨", "🌟", "💫", "☀️", "🌈"],
        sad: ["💭", "🌧️", "🤍", "🌙", "💫"],
        excited: ["🎉", "⚡", "🌟", "💫", "✨"],
        romantic: ["💕", "🌹", "❤️", "✨", "💫"]
    }
};

function generateAICaption(mood) {
    const template = captionTemplates[mood][Math.floor(Math.random() * captionTemplates[mood].length)];
    let caption = template;

    // Replace template placeholders with random words from word bank
    Object.keys(wordBank).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'g');
        if (caption.match(regex)) {
            const words = typeof wordBank[key] === 'object' && wordBank[key][mood] 
                ? wordBank[key][mood] 
                : wordBank[key];
            caption = caption.replace(regex, words[Math.floor(Math.random() * words.length)]);
        }
    });

    // Add AI signature
    const aiSignatures = [
        "🤖✍️ AI Generated",
        "🎯 AI Crafted",
        "✨ AI Enhanced",
        "💫 AI Optimized"
    ];
    
    return `${caption} ${aiSignatures[Math.floor(Math.random() * aiSignatures.length)]}`;
}

// Initialize elements
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const moodBtn = document.getElementById('moodBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const hashtagsContainer = document.getElementById('hashtagsContainer');

    // Generate random caption
    generateBtn.addEventListener('click', debounce(() => {
        if (buttonStates.generate) return;
        buttonStates.generate = true;
        generateBtn.classList.add('disabled');
        
        try {
            playClickSound();
            showLoader('captionLoader');
            const allCaptions = Object.values(captions).flat();
            if (allCaptions.length === 0) throw new Error('No captions available');
            
            // Simulate loading time for better UX
            setTimeout(() => {
                const randomCaption = allCaptions[Math.floor(Math.random() * allCaptions.length)];
                animateResult('captionResult', randomCaption);
                hideLoader('captionLoader');
                
                setTimeout(() => {
                    buttonStates.generate = false;
                    generateBtn.classList.remove('disabled');
                }, COOLDOWN_TIME);
            }, 1000);
        } catch (error) {
            hideLoader('captionLoader');
            showError('captionError', 'Failed to generate caption. Please try again.');
            buttonStates.generate = false;
            generateBtn.classList.remove('disabled');
        }
    }, 300));

    // Generate mood-based caption
    moodBtn.addEventListener('click', debounce(() => {
        if (buttonStates.mood) return;
        buttonStates.mood = true;
        moodBtn.classList.add('disabled');
        
        try {
            playClickSound();
            showLoader('moodLoader');
            const mood = document.getElementById('moodSelect').value;
            if (!captions[mood]) throw new Error('Invalid mood selected');
            
            setTimeout(() => {
                const moodCaptions = captions[mood];
                const randomCaption = moodCaptions[Math.floor(Math.random() * moodCaptions.length)];
                animateResult('moodResult', randomCaption);
                hideLoader('moodLoader');
                
                setTimeout(() => {
                    buttonStates.mood = false;
                    moodBtn.classList.remove('disabled');
                }, COOLDOWN_TIME);
            }, 800);
        } catch (error) {
            hideLoader('moodLoader');
            showError('moodError', 'Failed to generate mood-based caption. Please try again.');
            buttonStates.mood = false;
            moodBtn.classList.remove('disabled');
        }
    }, 300));

    // Voice input
    voiceBtn.addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
                voiceBtn.classList.add('listening');
                showLoader('voiceLoader');
            };

            recognition.onresult = (event) => {
                try {
                    const text = event.results[0][0].transcript;
                    if (!text) throw new Error('No speech detected');
                    animateResult('voiceResult', generateCaptionFromVoice(text));
                } catch (error) {
                    showError('voiceError', 'Failed to process voice input. Please try again.');
                }
            };

            recognition.onerror = () => {
                showError('voiceError', 'Voice recognition error. Please try again.');
            };

            recognition.onend = () => {
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Speaking';
                voiceBtn.classList.remove('listening');
                hideLoader('voiceLoader');
            };

            try {
                recognition.start();
            } catch (error) {
                showError('voiceError', 'Failed to start voice recognition. Please try again.');
            }
        } else {
            showError('voiceError', 'Speech recognition is not supported in your browser.');
        }
    });

    // Initialize trending hashtags
    updateHashtags();
    setInterval(() => {
        try {
            updateHashtags();
        } catch (error) {
            showError('hashtagError', 'Failed to update hashtags. Please refresh the page.');
        }
    }, 30000);

    // Social sharing
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            const platform = btn.dataset.platform;
            shareToSocial(platform);
        });
    });
});

// Helper functions
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

async function animateResult(elementId, text) {
    const element = document.getElementById(elementId);
    const aiProcessing = document.getElementById('aiProcessing');
    
    element.style.opacity = 0;
    aiProcessing.classList.add('active');
    
    await new Promise(resolve => setTimeout(resolve, AI_PROCESSING_TIME));
    aiProcessing.classList.remove('active');
    
    element.style.opacity = 1;
    await typeText(element, text);
}

function typeText(element, text) {
    element.textContent = '';
    element.classList.add('typing-animation');
    
    return new Promise(resolve => {
        let index = 0;
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, TYPING_SPEED);
            } else {
                element.classList.remove('typing-animation');
                resolve();
            }
        }
        type();
    });
}

function updateHashtags() {
    showLoader('hashtagLoader');
    setTimeout(() => {
        const container = document.getElementById('hashtagsContainer');
        container.innerHTML = '';
        shuffleArray(trendingHashtags).slice(0, 4).forEach(hashtag => {
            const span = document.createElement('span');
            span.className = 'hashtag';
            span.textContent = hashtag;
            container.appendChild(span);
        });
        hideLoader('hashtagLoader');
    }, 1200);
}

// Replace the existing generateCaptionFromVoice function
function generateCaptionFromVoice(text) {
    const words = text.toLowerCase().split(' ');
    const moodAnalysis = {
        happy: words.filter(word => ['happy', 'good', 'great', 'awesome', 'blessed', 'joy'].includes(word)).length,
        sad: words.filter(word => ['sad', 'bad', 'terrible', 'pain', 'hurt', 'lonely'].includes(word)).length,
        excited: words.filter(word => ['excited', 'wow', 'amazing', 'fantastic', 'thrill'].includes(word)).length,
        romantic: words.filter(word => ['love', 'heart', 'sweet', 'romance', 'cute'].includes(word)).length
    };

    const mood = Object.entries(moodAnalysis)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    return generateAICaption(mood);
}

function generateAICaption(mood) {
    const baseCaption = captions[mood][Math.floor(Math.random() * captions[mood].length)];
    const aiEnhancements = [
        "✨ AI Enhanced",
        "🤖 AI Generated",
        "🎯 AI Optimized"
    ];
    return `${baseCaption} ${aiEnhancements[Math.floor(Math.random() * aiEnhancements.length)]}`;
}

const aiPhrases = [
    "Analyzing context...",
    "Processing sentiment...",
    "Generating creative output...",
    "Optimizing caption...",
    "Fine-tuning results..."
];

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function shareToSocial(platform) {
    const caption = document.getElementById('captionResult').textContent;
    const urls = {
        instagram: `https://instagram.com/share?text=${encodeURIComponent(caption)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(caption)}`
    };
    window.open(urls[platform], '_blank');
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 3000);
}

// Add these helper functions
function showLoader(loaderId) {
    document.getElementById(loaderId).classList.add('active');
}

function hideLoader(loaderId) {
    document.getElementById(loaderId).classList.remove('active');
}
