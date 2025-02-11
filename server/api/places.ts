import express from 'express';
import { Client, PlaceData, LatLng } from '@googlemaps/google-maps-services-js';

const router = express.Router();
const client = new Client({});

router.get('/search', async (req, res) => {
    try {
        const { lat, lng, query } = req.query;
        
        const params = {
            location: { 
                lat: Number(lat) || 0, 
                lng: Number(lng) || 0 
            } as LatLng,
            radius: 5000, // 5km radius
            keyword: query ? String(query) : undefined,
            key: process.env.GOOGLE_MAPS_API_KEY || ''
        };

        const response = await client.placesNearby({ params });
        
        const places = response.data.results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            rating: place.rating,
            location: place.geometry?.location,
            types: place.types
        }));

        res.json(places);
    } catch (error) {
        console.error('Places API Error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router; 