import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import placesRouter from "./api/places.js";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: join(__dirname, "..", ".env") });

// Log environment variables for debugging (remove in production)
console.log("API Key loaded:", process.env.GOOGLE_MAPS_API_KEY ? "YES" : "NO");
console.log("PORT:", process.env.PORT);

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

// Add a test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Create HTTP server
const server = http.createServer(app);

// Function to find an available port
const startServer = (port) => {
  server.listen(port);
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use, trying ${port + 1}`);
      startServer(port + 1);
    }
  });
  server.on("listening", () => {
    const actualPort = server.address().port;
    console.log(`Server running on port ${actualPort}`);
    // If you need to communicate the port to the frontend
    if (actualPort !== PORT) {
      console.log(
        `Note: Update your vite.config.ts proxy target to http://localhost:${actualPort}`
      );
    }
  });
};

startServer(PORT);
