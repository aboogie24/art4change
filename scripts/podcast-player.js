// Global variables
let episodes = [];
let episodeListContainer, mainPlayer, mainPlayerSource, currentEpisodeTitle, currentEpisodeSummary;

// Load episodes from JSON file
async function loadEpisodeData() {
    try {
        const response = await fetch('data/episodes.json');
        episodes = await response.json();
        return episodes;
    } catch (error) {
        console.error('Error loading episode data:', error);
        // Fallback data if JSON fails to load
        episodes = [
            {
                id: 'E03',
                title: 'E03: The Gravity Well of Sleep',
                date: 'September 25, 2025',
                duration: '45:12',
                audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                summary: "Join us as we explore the quantum mechanics of a good night's rest. Is sleep a necessary collapse into a lower energy state, or an interstellar journey to the outer rim of consciousness? Dr. Elena Varma explains the latest neurobiology.",
                notes: '### Show Notes: E03\n\n- **Guest:** Dr. Elena Varma, Neurobiologist at the Institute of Somatic Astronomy.\n- **Topics Covered:** REM cycles, dark matter\'s effect on dreams, and the theory of multi-dimensional naps.\n- **Links:** Read Dr. Varma\'s paper on chronobiology and black holes [here].\n'
            }
        ];
        return episodes;
    }
}

// Initialize DOM elements
function initializeDOMElements() {
    episodeListContainer = document.getElementById('episode-list');
    mainPlayer = document.getElementById('main-player');
    mainPlayerSource = document.getElementById('main-player-source');
    currentEpisodeTitle = document.getElementById('current-episode-title');
    currentEpisodeSummary = document.getElementById('current-episode-summary');
}

// Populate Episode List and Inject HTML
function renderEpisodes() {
    episodes.forEach(ep => {
        const card = document.createElement('div');
        card.id = `${ep.id}-card`;
        card.className = 'episode-card bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-primary hover:shadow-teal-900/30 transition duration-300 cursor-pointer';
        card.onclick = () => loadEpisode(ep.id);
        
        card.innerHTML = `
            <div class="flex items-start mb-4">
                <div class="flex-shrink-0 bg-primary-dark p-3 rounded-xl mr-4 text-white">
                    <i data-lucide="play" class="w-6 h-6"></i>
                </div>
                <div class="flex-grow">
                    <p class="text-sm text-gray-400">${ep.date} &bull; ${ep.duration}</p>
                    <h3 class="text-xl font-bold text-white mt-1">${ep.title}</h3>
                </div>
            </div>
            <p class="text-gray-400 mb-4">${ep.summary}</p>
            <div class="flex justify-between items-center text-sm font-medium">
                <button onclick="loadEpisode('${ep.id}', true)" class="text-primary hover:text-teal-300 flex items-center transition duration-200">
                    <i data-lucide="play" class="w-4 h-4 mr-1"></i> Play Episode
                </button>
                <a href="#E03-notes" onclick="event.stopPropagation(); showNotes('${ep.id}')" class="text-gray-500 hover:text-white transition duration-200">
                    Show Notes
                </a>
            </div>
        `;
        episodeListContainer.appendChild(card);
    });
    
    // Re-run icon rendering for dynamically added content
    if (typeof createIcons !== 'undefined') {
        const { Play, Mic } = window.lucide || {};
        if (Play && Mic) {
            createIcons({ icons: { Play, Mic } });
        }
    }
}

// Load Episode into Main Player
function loadEpisode(episodeId, autoPlay = false) {
    const ep = episodes.find(e => e.id === episodeId);
    if (!ep) return;

    // Update Main Player Card Content
    currentEpisodeTitle.textContent = ep.title;
    currentEpisodeSummary.textContent = ep.summary;

    // Update Audio Element Source
    mainPlayerSource.src = ep.audioSrc;
    mainPlayer.load(); // Load the new source

    // Update the "Listen Now" button to reflect the new episode
    const listenNowButton = document.querySelector('#main-player-card button');
    listenNowButton.setAttribute('onclick', `playEpisode('${ep.id}')`);
    
    // Auto-play if requested (e.g., from the episode list card)
    if (autoPlay) {
        mainPlayer.play().catch(e => console.log('Autoplay prevented. Click the player controls to start.'));
    }

    // Smooth scroll back to the hero section
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
}

// Mock Play Function (Primarily for the main button)
function playEpisode(episodeId) {
    // Ensure the correct episode is loaded first if it's not the current one
    const currentEpId = currentEpisodeTitle.textContent.split(':')[0];
    if (currentEpId !== episodeId) {
        loadEpisode(episodeId, true);
    } else {
        // If it is the current one, just play/pause
        if (mainPlayer.paused) {
            mainPlayer.play().catch(e => console.log('Autoplay failed.'));
        } else {
            mainPlayer.pause();
        }
    }
}

// Show Notes Modal (Simple implementation)
function showNotes(episodeId) {
    const ep = episodes.find(e => e.id === episodeId);
    if (!ep) return;

    // Use a simple, non-alert/non-confirm custom box for demonstration
    const modalContent = 
        `<div class="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center p-4" onclick="this.remove()">
            <div class="bg-gray-800 p-8 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                <h3 class="text-3xl font-bold text-primary mb-4">${ep.title} - Show Notes</h3>
                <p class="text-gray-400 whitespace-pre-wrap">${ep.notes}</p>
                <button onclick="this.parentNode.parentNode.remove()" class="mt-6 w-full p-3 bg-primary-dark rounded-xl text-white font-semibold hover:bg-primary-light transition duration-200">
                    Close
                </button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

// Form Handling Functions
function initializeFormHandling() {
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('newsletter-message').classList.remove('hidden');
            // In a real app, you would send this email to a server/API endpoint
            this.reset();
        });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('contact-message-success').classList.remove('hidden');
            // In a real app, you would send this data to a server/API endpoint
            this.reset();
            setTimeout(() => {
                document.getElementById('contact-message-success').classList.add('hidden');
            }, 5000);
        });
    }
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Hide mobile menu when a link is clicked
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Make functions globally available
window.loadEpisode = loadEpisode;
window.playEpisode = playEpisode;
window.showNotes = showNotes;

// Main initialization function
async function initializePodcastPlayer() {
    try {
        // Load episode data
        await loadEpisodeData();
        
        // Initialize DOM elements
        initializeDOMElements();
        
        // Render episodes
        renderEpisodes();
        
        // Load the latest episode into the main player
        if (episodes.length > 0) {
            loadEpisode(episodes[0].id);
        }
        
        // Initialize form handling
        initializeFormHandling();
        
        // Initialize mobile menu
        initializeMobileMenu();
        
    } catch (error) {
        console.error('Error initializing podcast player:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializePodcastPlayer);
