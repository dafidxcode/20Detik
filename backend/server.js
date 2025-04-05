const express = require('express');
const cors = require('cors');
const scrape20DetikVideos = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// API endpoint
app.get('/api/videos', async (req, res) => {
    try {
        const data = await scrape20DetikVideos();
        
        if (data.success) {
            res.json(data);
        } else {
            res.status(500).json({ error: data.error });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`20Detik is running on http://localhost:${PORT}`);
});