import express from "express";
import { Client } from "@googlemaps/google-maps-services-js";
const router = express.Router();
const googleMapsClient = new Client({});
// Google Places API endpoint
router.get("/", async (req, res) => {
    try {
        const { query, lat, lng, radius = 10000 } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }
        // Use provided coordinates or default to Lehi, UT
        const latitude = parseFloat(lat) || 40.3916;
        const longitude = parseFloat(lng) || -111.8508;
        // Use the Text Search API
        const response = await googleMapsClient.textSearch({
            params: {
                query: query,
                location: { lat: latitude, lng: longitude },
                radius: parseInt(radius),
                key: process.env.GOOGLE_MAPS_API_KEY || "",
            },
        });
        const places = response.data.results.map((place) => ({
            id: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            price_level: place.price_level,
            photos: place.photos?.map((photo) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`),
            location: place.geometry?.location,
            types: place.types,
        }));
        res.json(places);
    }
    catch (error) {
        console.error("Error fetching places:", error);
        res.status(500).json({ error: "Failed to fetch places" });
    }
});
export default router;
