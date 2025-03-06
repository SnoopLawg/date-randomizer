import express from "express";

const router = express.Router();

// Mock data for different types of places
const generateMockData = (term, location) => {
  const mockBusinesses = {
    Restaurant: [
      {
        name: "The Local Bistro",
        rating: 4.5,
        price: "$$",
        category: "restaurant",
      },
      {
        name: "Farm to Table",
        rating: 4.2,
        price: "$$$",
        category: "restaurant",
      },
      { name: "Urban Plate", rating: 4.0, price: "$$", category: "restaurant" },
    ],
    "Coffee Shop": [
      { name: "Brew & Beans", rating: 4.8, price: "$", category: "coffee" },
      { name: "Morning Fix", rating: 4.3, price: "$", category: "coffee" },
      { name: "Caffeine Corner", rating: 4.1, price: "$", category: "coffee" },
    ],
    "Movie Theater": [
      {
        name: "Cinema Center",
        rating: 4.2,
        price: "$$",
        category: "entertainment",
      },
      {
        name: "Downtown Movies",
        rating: 3.9,
        price: "$$",
        category: "entertainment",
      },
    ],
    Museum: [
      { name: "City Art Museum", rating: 4.6, price: "$$", category: "arts" },
      { name: "Historical Museum", rating: 4.4, price: "$", category: "arts" },
    ],
    Park: [
      {
        name: "Central Park",
        rating: 4.8,
        price: "Free",
        category: "outdoors",
      },
      {
        name: "Riverside Park",
        rating: 4.5,
        price: "Free",
        category: "outdoors",
      },
    ],
  };

  // Default to restaurant if term not found
  const businesses = mockBusinesses[term] || mockBusinesses["Restaurant"];

  return businesses.map((business, index) => ({
    id: `mock-${term}-${index}`,
    name: business.name,
    rating: business.rating,
    review_count: Math.floor(Math.random() * 200) + 50,
    price: business.price,
    url: "https://example.com",
    image_url: `https://placehold.co/400x300/random?text=${encodeURIComponent(
      business.name
    )}`,
    categories: [{ title: business.category }],
    location: {
      address1: `${Math.floor(Math.random() * 999) + 1} Main St`,
      city: location || "Nearby City",
      state: "UT",
      zip_code: "84043",
      display_address: [
        `${Math.floor(Math.random() * 999) + 1} Main St`,
        location || "Nearby City, UT 84043",
      ],
    },
    coordinates: {
      latitude: 40.2338 + (Math.random() * 0.1 - 0.05),
      longitude: -111.6585 + (Math.random() * 0.1 - 0.05),
    },
    phone: `+1${Math.floor(Math.random() * 1000000000) + 1000000000}`,
    display_phone: `(${Math.floor(Math.random() * 900) + 100}) ${
      Math.floor(Math.random() * 900) + 100
    }-${Math.floor(Math.random() * 9000) + 1000}`,
  }));
};

// Yelp API endpoint (now using only mock data)
router.get("/", async (req, res) => {
  try {
    const { term, location } = req.query;

    if (!term || !location) {
      return res
        .status(400)
        .json({ error: "Term and location parameters are required" });
    }

    // Generate mock data based on the term
    const mockBusinesses = generateMockData(term, location);

    // Return mock data in the format expected by the client
    res.json({
      businesses: mockBusinesses,
    });
  } catch (error) {
    console.error("Error generating mock data:", error);
    res.status(500).json({ error: "Failed to generate mock data" });
  }
});

export default router;
