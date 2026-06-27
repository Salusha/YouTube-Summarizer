/**
 * YouTube Video Summarizer - Server Entry Point
 *
 * Loads environment variables and starts the Express server.
 * Separated from app configuration for testability.
 */

import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3001;

// Validate critical environment variables on startup
if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is not set in .env file.");
  console.error("Get your API key at: https://aistudio.google.com/apikey");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ POST /api/summarize ready`);
});
