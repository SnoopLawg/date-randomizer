import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import placesRouter from './api/places.js';
import yelpRouter from './api/yelp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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