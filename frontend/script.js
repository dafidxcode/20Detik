document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:3000/api/videos';
    const categoriesContainer = document.getElementById('categories-container');
    const updateTimeElement = document.getElementById('update-time');
    
    // Modal elements
    const modal = document.getElementById('video-modal');
    const closeBtn = document.querySelector('.close-btn');
    const videoPlayer = document.getElementById('video-player');
    const videoTitleElement = document.getElementById('video-modal-title');
    const videoDescElement = document.getElementById('video-modal-desc');
    
    // Current playing video
    let currentVideo = null;
    
    // Fetch videos from backend
    async function fetchVideos() {
        try {
            categoriesContainer.innerHTML = '<div class="loading">Memuat video...</div>';
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.success) {
                updateTimeElement.textContent = new Date(data.lastUpdated).toLocaleString();
                renderCategories(data.categories);
            } else {
                showError('Gagal memuat video: ' + data.error);
            }
        } catch (error) {
            showError('Terjadi kesalahan: ' + error.message);
        }
    }
    
    // Render categories and videos
    function renderCategories(categories) {
        categoriesContainer.innerHTML = '';
        
        if (!categories || Object.keys(categories).length === 0) {
            showError('Tidak ada video yang ditemukan');
            return;
        }
        
        for (const [categoryTitle, videos] of Object.entries(categories)) {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            
            const categoryTitleElement = document.createElement('h2');
            categoryTitleElement.className = 'category-title';
            categoryTitleElement.textContent = categoryTitle;
            
            const videosGrid = document.createElement('div');
            videosGrid.className = 'videos-grid';
            
            videos.forEach(video => {
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.innerHTML = `
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail}" alt="${video.title}">
                    </div>
                    <div class="video-info">
                        <div class="video-title">${video.title}</div>
                        <div class="video-desc">${video.description}</div>
                    </div>
                `;
                
                videoCard.addEventListener('click', () => playVideo(video));
                videosGrid.appendChild(videoCard);
            });
            
            categoryElement.appendChild(categoryTitleElement);
            categoryElement.appendChild(videosGrid);
            categoriesContainer.appendChild(categoryElement);
        }
    }
    
    // Play video in modal
    function playVideo(video) {
        currentVideo = video;
        
        let videoUrl = '';
        if (video.source === 'youtube') {
            videoUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1`;
        } else if (video.source === 'vimeo') {
            videoUrl = `https://player.vimeo.com/video/${video.videoId}?autoplay=1`;
        } else {
            // Default detik video
            videoUrl = `https://cdn.detik.net/player/${video.videoId}/embed`;
        }
        
        videoPlayer.src = videoUrl;
        videoTitleElement.textContent = video.title;
        videoDescElement.textContent = video.description;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Pause video when modal is closed
        if (videoPlayer) {
            videoPlayer.src = '';
        }
    }
    
    // Show error message
    function showError(message) {
        categoriesContainer.innerHTML = `<div class="error">${message}</div>`;
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Initial load
    fetchVideos();
});