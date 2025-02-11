import express from 'express';
import axios from 'axios';

const router = express.Router();

interface YelpSearchParams {
    term: string;
    latitude?: number;
    longitude?: number;
    location?: string;
}

router.get('/search', async (req, res) => {
    try {
        const { term, latitude, longitude, location } = req.query;
        
        const searchParams: YelpSearchParams = {
            term: typeof term === 'string' ? term : '',
            ...(latitude && longitude ? {
                latitude: parseFloat(latitude as string),
                longitude: parseFloat(longitude as string)
            } : {
                location: location as string || 'New York, NY'
            })
        };

        const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
            headers: {
                Authorization: `Bearer ${process.env.YELP_API_KEY}`
            },
            params: searchParams
        });

        res.json(response.data);
    } catch (error) {
        console.error('Yelp API Error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router; 