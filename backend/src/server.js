/**
 * YouTube Video Summarizer - Server Entry Point
 *
 * Loads environment variables and starts the Express server.
 */

import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3001;

// Validate critical environment variables on startup
if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is not set.");
  console.error("Set it in .env (local) or environment variables (Render).");
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ POST /api/summarize ready`);
});
