import express from 'express';
const router = express.Router();

// Placeholder for Yelp API integration
router.get('/search', async (req, res) => {
    try {
        // TODO: Implement Yelp API integration
        res.json({ message: "Yelp API integration coming soon" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router; 