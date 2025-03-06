import express from "express";
import axios from "axios";
const router = express.Router();
// Yelp API endpoint
router.get("/", async (req, res) => {
    try {
        const { term, location } = req.query;
        if (!term || !location) {
            return res
                .status(400)
                .json({ error: "Term and location parameters are required" });
        }
        // Check if we have a Yelp API key
        if (!process.env.YELP_API_KEY) {
            // Return mock data if no API key is available
            console.log("No Yelp API key found, returning mock data");
            return res.json({
                businesses: [
                    {
                        id: "mock-id",
                        name: term,
                        rating: 4.5,
                        review_count: 100,
                        price: "$$",
                        url: "https://www.yelp.com",
                        location: {
                            address1: "123 Main St",
                            city: "Lehi",
                            state: "UT",
                            zip_code: "84043",
                        },
                    },
                ],
            });
        }
        // If we have an API key, make the real request
        const response = await axios.get("https://api.yelp.com/v3/businesses/search", {
            headers: {
                Authorization: `Bearer ${process.env.YELP_API_KEY}`,
            },
            params: {
                term,
                location,
                limit: 1,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error("Error fetching Yelp data:", error);
        res.status(500).json({ error: "Failed to fetch Yelp data" });
    }
});
export default router;
