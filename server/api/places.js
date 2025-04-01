import express from "express";
import { Client } from "@googlemaps/google-maps-services-js";
import axios from "axios";

const router = express.Router();
const googleMapsClient = new Client({});

// Google Places API endpoint
router.get("/", async (req, res) => {
  try {
    console.log("Received places request with query params:", req.query);
    const { query, lat, lng, radius = 10000 } = req.query;

    if (!query) {
      console.log("Missing query parameter");
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Use provided coordinates or default to Lehi, UT
    const latitude = parseFloat(lat) || 40.3916;
    const longitude = parseFloat(lng) || -111.8508;

    console.log("Making request to Google Places API with params:", {
      query,
      location: { lat: latitude, lng: longitude },
      radius: parseInt(radius),
      key: process.env.GOOGLE_MAPS_API_KEY ? "Present" : "Missing",
    });

    // Use the Text Search API
    const response = await googleMapsClient.textSearch({
      params: {
        query: query,
        location: { lat: latitude, lng: longitude },
        radius: parseInt(radius),
        key: process.env.GOOGLE_MAPS_API_KEY || "",
      },
    });

    console.log(`Found ${response.data.results.length} places`);

    const places = response.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      price_level: place.price_level,
      photos: place.photos?.map(
        (photo) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      ),
      location: place.geometry?.location,
      types: place.types,
    }));

    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

export default router;
