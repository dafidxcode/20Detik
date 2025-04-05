const axios = require('axios');
const cheerio = require('cheerio');

async function scrape20DetikVideos() {
    try {
        const { data } = await axios.get('https://20.detik.com');
        const $ = cheerio.load(data);
        
        const categories = {};
        
        // Scrape each video category section
        $('.category-section').each((i, section) => {
            const categoryTitle = $(section).find('.category-title').text().trim();
            const videos = [];
            
            $(section).find('.video-item').each((j, item) => {
                const title = $(item).find('.video-title').text().trim();
                const description = $(item).find('.video-desc').text().trim();
                const thumbnail = $(item).find('.video-thumb img').attr('src');
                const videoId = $(item).attr('data-video-id');
                const videoSource = $(item).attr('data-video-source');
                
                videos.push({
                    title,
                    description,
                    thumbnail,
                    videoId,
                    source: videoSource || 'detik'
                });
            });
            
            if (videos.length > 0) {
                categories[categoryTitle] = videos;
            }
        });
        
        return {
            success: true,
            lastUpdated: new Date().toISOString(),
            categories
        };
    } catch (error) {
        console.error('Scraping error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = scrape20DetikVideos;