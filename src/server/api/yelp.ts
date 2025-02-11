import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/api/yelp', async (req, res) => {
  try {
    const { name, address } = req.query;
    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`
      },
      params: {
        term: name,
        location: address,
        limit: 1
      }
    });

    const business = response.data.businesses[0];
    if (business) {
      res.json({
        yelpRating: business.rating,
        yelpReviews: business.review_count,
        yelpPrice: business.price
      });
    } else {
      res.json({});
    }
  } catch (error) {
    console.error('Error fetching Yelp data:', error);
    res.json({});
  }
});

export default router; 