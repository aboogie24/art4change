// YouTube Podcast Integration
const YOUTUBE_API_KEY = 'AIzaSyAh6grRsw9rxp3lNAQCqmL4C5NjYR_FbEQ';
const CHANNEL_ID = 'UCK39SH2J9-e8B_ki3jdvOdg';
const MAX_RESULTS = 50; // Fetch up to 50 videos

// Convert ISO 8601 duration to seconds
function durationToSeconds(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    return hours * 3600 + minutes * 60 + seconds;
}

// Format duration from ISO 8601 to human readable (e.g., "PT1H24M15S" to "1hr 24m")
function formatDuration(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    
    if (hours > 0) {
        return `${hours}hr ${minutes}m`;
    }
    return `${minutes}m`;
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Fetch videos from YouTube channel
async function fetchYouTubeVideos() {
    try {
        // Step 1: Get uploads playlist ID
        const channelResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
        );
        const channelData = await channelResponse.json();
        
        if (!channelData.items || channelData.items.length === 0) {
            throw new Error('Channel not found');
        }
        
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        
        // Step 2: Get videos from uploads playlist
        const playlistResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${MAX_RESULTS}&key=${YOUTUBE_API_KEY}`
        );
        const playlistData = await playlistResponse.json();
        
        if (!playlistData.items) {
            throw new Error('No videos found');
        }
        
        // Step 3: Get video details (including duration)
        const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');
        const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const videosData = await videosResponse.json();
        
        // Filter out YouTube Shorts (videos under 60 seconds)
        const podcasts = videosData.items.filter(video => {
            const durationInSeconds = durationToSeconds(video.contentDetails.duration);
            return durationInSeconds >= 60; // Only include videos 60 seconds or longer
        });
        
        return podcasts.map(video => ({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.high.url,
            thumbnailMedium: video.snippet.thumbnails.medium.url,
            publishedAt: video.snippet.publishedAt,
            duration: video.contentDetails.duration,
            viewCount: video.statistics.viewCount
        }));
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}

// Create HTML for favorite podcasts (first 3)
function createFavoritePodcastHTML(video, index) {
    const modalId = `modal-fav-${index}`;
    const duration = formatDuration(video.duration);
    const date = formatDate(video.publishedAt);
    
    return `
        <div class="col mb-3">
            <div class="d-flex flex-column gap-3 h-100">
                <div class="position-relative h-100">
                    <div class="image-overlay-2"></div>
                    <div class="position-absolute start-0 top-0 w-100 h-100" style="z-index: 2;">
                        <div class="d-flex justify-content-center align-items-center h-100">
                            <button type="button" class="btn request-loader" data-bs-toggle="modal"
                                data-bs-target="#${modalId}" data-video-id="${video.id}">
                                <i class="fa-solid fa-play ms-1"></i>
                            </button>
                        </div>
                    </div>
                    <img src="${video.thumbnail}" alt="${video.title}" class="img-fluid rounded-3">
                </div>
                <div class="d-flex flex-row gap-5">
                    <div class="d-flex flex-row align-items-center gap-2">
                        <i class="fa-regular fa-clock accent-color"></i>
                        ${duration}
                    </div>
                    <div class="d-flex flex-row align-items-center gap-2">
                        <i class="fa-solid fa-calendar-days accent-color"></i>
                        ${date}
                    </div>
                </div>
                <h5 class="font-1 fw-bold lh-1">${video.title}</h5>
            </div>
            <div class="modal fade bg-overlay" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content bg-dark-color">
                        <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close" style="z-index: 1050;"></button>
                        <div class="modal-video-container"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create HTML for recent episodes
function createRecentEpisodeHTML(video, index) {
    const modalId = `episode-${index}`;
    const duration = formatDuration(video.duration);
    const date = formatDate(video.publishedAt);
    
    return `
        <div class="col mb-3">
            <div class="d-flex flex-column gap-3 h-100">
                <div class="position-relative h-100">
                    <div class="image-overlay-2"></div>
                    <div class="position-absolute start-0 top-0 w-100 h-100" style="z-index: 2;">
                        <div class="d-flex justify-content-center align-items-center h-100">
                            <button type="button" class="btn request-loader" data-bs-toggle="modal"
                                data-bs-target="#${modalId}" data-video-id="${video.id}">
                                <i class="fa-solid fa-play ms-1"></i>
                            </button>
                        </div>
                    </div>
                    <img src="${video.thumbnail}" alt="${video.title}" class="img-fluid rounded-3">
                </div>
                <div class="d-flex flex-row gap-5">
                    <div class="d-flex flex-row align-items-center gap-2">
                        <i class="fa-regular fa-clock accent-color"></i>
                        ${duration}
                    </div>
                    <div class="d-flex flex-row align-items-center gap-2">
                        <i class="fa-solid fa-calendar-days accent-color"></i>
                        ${date}
                    </div>
                </div>
                <h5 class="font-1 fw-bold lh-1">${video.title}</h5>
            </div>
            <div class="modal fade bg-overlay" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content bg-dark-color">
                        <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close" style="z-index: 1050;"></button>
                        <div class="modal-video-container"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize modal event listeners using event delegation
function initializeModalHandlers() {
    // Use event delegation on the document to handle dynamically added modals
    document.addEventListener('show.bs.modal', function (event) {
        const modal = event.target;
        const button = event.relatedTarget;
        
        if (button && button.hasAttribute('data-video-id')) {
            const videoId = button.getAttribute('data-video-id');
            const container = modal.querySelector('.modal-video-container');
            
            if (container && videoId) {
                // Create iframe when modal opens
                container.innerHTML = `
                    <iframe class="ifr-video"
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                `;
            }
        }
    });
    
    // Handle modal hidden event - remove video when modal closes
    document.addEventListener('hidden.bs.modal', function (event) {
        const modal = event.target;
        const container = modal.querySelector('.modal-video-container');
        
        if (container) {
            // Clear iframe to stop video playback
            container.innerHTML = '';
        }
    });
}

// Initialize and load podcasts
async function loadPodcasts() {
    const videos = await fetchYouTubeVideos();
    
    if (videos.length === 0) {
        console.error('No videos found or error loading videos');
        return;
    }
    
    // Load favorite podcasts (first 3 videos)
    const favoritesContainer = document.getElementById('favorite-podcasts');
    if (favoritesContainer) {
        const favoriteVideos = videos.slice(0, 3);
        favoritesContainer.innerHTML = favoriteVideos
            .map((video, index) => createFavoritePodcastHTML(video, index))
            .join('');
    }
    
    // Load recent episodes (next 6 videos, or all if less than 9 total)
    const recentContainer = document.getElementById('recent-episodes');
    if (recentContainer) {
        const recentVideos = videos.slice(3, 9);
        recentContainer.innerHTML = recentVideos
            .map((video, index) => createRecentEpisodeHTML(video, index))
            .join('');
    }
    
    // Initialize modal handlers after content is loaded
    initializeModalHandlers();
}

// Load podcasts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPodcasts);
} else {
    loadPodcasts();
}
