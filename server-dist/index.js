import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import placesRouter from "./api/places.js";
import yelpRouter from "./api/yelp.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Add logging middleware to debug requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(cors());
app.use(express.json());
// Mount the routers
app.use("/api/places", placesRouter);
app.use("/api/yelp", yelpRouter);
// Add a test route
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
