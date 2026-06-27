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
app.use(cors());

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
