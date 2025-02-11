import express from 'express';
import { Client } from '@googlemaps/google-maps-services-js';

const router = express.Router();
const googleMapsClient = new Client({});

router.get('/api/places', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await googleMapsClient.placesNearby({
      params: {
        location: { lat: req.query.lat || 0, lng: req.query.lng || 0 },
        radius: 5000,
        keyword: query,
        key: process.env.GOOGLE_MAPS_API_KEY!
      }
    });

    const places = response.data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      price_level: place.price_level,
      photos: place.photos?.map(photo => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      ),
      distance: place.distance
    }));

    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

export default router; 