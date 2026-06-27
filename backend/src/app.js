/**
 * Express Application Configuration
 *
 * Sets up middleware (CORS, JSON parsing) and mounts routes.
 * CORS is configured for production (Vercel frontend) and local development.
 * Includes a global error handler for consistent error responses.
 */

import express from "express";
import cors from "cors";
import summarizeRoutes from "./routes/summarize.routes.js";

const app = express();

// --- CORS Configuration ---
// Allow requests from the Vercel frontend and local dev server
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:4173", // Vite preview
];

// Add production frontend URL if configured
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In production, reject unknown origins
      if (process.env.NODE_ENV === "production") {
        return callback(new Error("Not allowed by CORS"), false);
      }

      // In development, allow all origins
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// --- Middleware ---
app.use(express.json({ limit: "1mb" })); // Parse JSON with size limit

// --- Routes ---
app.use("/api", summarizeRoutes);

// Health check endpoint (used by Render for zero-downtime deploys)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Global Error Handler ---
app.use((err, _req, res, _next) => {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode
    ? err.message
    : "An internal server error occurred. Please try again later.";

  res.status(statusCode).json({ error: message });
});

export default app;
