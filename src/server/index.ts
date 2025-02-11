import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import placesRouter from './api/places';
import yelpRouter from './api/yelp';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', placesRouter);
app.use('/api', yelpRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 