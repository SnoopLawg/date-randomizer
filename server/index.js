import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import placesRouter from "./api/places.js";
import http from "http";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: join(__dirname, "..", ".env") });

// Log environment variables for debugging (remove in production)
console.log("API Key loaded:", process.env.GOOGLE_MAPS_API_KEY ? "YES" : "NO");
console.log("PORT:", process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS with environment-aware settings
const isDevelopment = process.env.NODE_ENV !== "production";
const allowedOrigins = isDevelopment
  ? ["http://localhost:5173", "http://localhost:5174"]
  : process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const error = new Error("Not allowed by CORS");
        console.error(`CORS blocked request from origin: ${origin}`);
        return callback(error, false);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// Add logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Add rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);

// Mount the routers
app.use("/api/places", placesRouter);

// Add a test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
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
