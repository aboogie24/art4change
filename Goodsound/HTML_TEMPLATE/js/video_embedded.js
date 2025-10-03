$(function () {
    var videoBtn = $('.video-btn');

    // Handle dynamic video containers with video-btn
    videoBtn.click(function () {
        var videoContainer = $(this).closest('.video-container');
        
        // Check if iframe already exists, if so remove it first
        var existingIframe = videoContainer.find('.video-iframe');
        if (existingIframe.length > 0) {
            existingIframe.remove();
            return; // Toggle off - just remove the video
        }
        
        var src = videoContainer.data('url');
        var title = videoContainer.data('title');
        var videoFrame = $('<iframe>', {
            src: src,
            frameborder: 0,
            title: title,
            allow : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ,
            class: 'video-iframe'
        });

        videoContainer.append(videoFrame);
    });

    // Fix for Bootstrap modals - only handle static modals (not dynamically created ones)
    // Dynamically created modals with .modal-video-container are handled by youtube-podcast.js
    $('.modal').on('hidden.bs.modal', function () {
        var $modal = $(this);
        
        // Skip modals that are handled by youtube-podcast.js
        if ($modal.find('.modal-video-container').length > 0) {
            return;
        }
        
        // Handle static modals with direct iframes
        var iframe = $modal.find('iframe.ifr-video');
        if (iframe.length > 0) {
            // Stop video by resetting src
            var src = iframe.attr('src');
            iframe.attr('src', '');
            iframe.attr('src', src);
        }
    });
});
