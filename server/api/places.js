import express from "express";
import { Client } from "@googlemaps/google-maps-services-js";
import axios from "axios";

const router = express.Router();
const googleMapsClient = new Client({});

// Input validation middleware
const validatePlacesRequest = (req, res, next) => {
  const { query, lat, lng, radius = 10000 } = req.query;

  if (!query || typeof query !== "string" || query.length > 100) {
    return res.status(400).json({ error: "Invalid query parameter" });
  }

  if (lat && (isNaN(lat) || lat < -90 || lat > 90)) {
    return res.status(400).json({ error: "Invalid latitude" });
  }

  if (lng && (isNaN(lng) || lng < -180 || lng > 180)) {
    return res.status(400).json({ error: "Invalid longitude" });
  }

  if (radius && (isNaN(radius) || radius < 0 || radius > 50000)) {
    return res.status(400).json({ error: "Invalid radius" });
  }

  next();
};

// Google Places API endpoint
router.get("/", validatePlacesRequest, async (req, res) => {
  try {
    const { query, lat, lng, radius = 10000 } = req.query;

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
      // Proxy photo requests through our server
      photos: place.photos?.map(
        (photo) => `/api/places/photo/${photo.photo_reference}`
      ),
      location: place.geometry?.location,
      types: place.types,
    }));

    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({
      error: "Failed to fetch places",
      message:
        process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
});

// Add photo proxy endpoint
router.get("/photo/:photoReference", async (req, res) => {
  try {
    const { photoReference } = req.params;
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(photoUrl, { responseType: "stream" });
    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).json({
      error: "Failed to fetch photo",
      message:
        process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
});

export default router;
