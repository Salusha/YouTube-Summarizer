/**
 * Express Application Configuration
 *
 * CORS open for all origins (Vercel, localhost, any client).
 * JSON parsing, routes, and global error handler.
 */

import express from "express";
import cors from "cors";
import summarizeRoutes from "./routes/summarize.routes.js";

const app = express();

// Allow all origins — no CORS issues between Vercel and Render
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api", summarizeRoutes);

// Health check (Render uses this for zero-downtime deploys)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root route (so "Cannot GET /" doesn't confuse people)
app.get("/", (_req, res) => {
  res.json({ message: "YouTube Summarizer API", docs: "POST /api/summarize" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(`[ERROR] ${err.message}`);
  const statusCode = err.statusCode || 500;
  const message = err.statusCode
    ? err.message
    : "An internal server error occurred. Please try again later.";
  res.status(statusCode).json({ error: message });
});

export default app;
