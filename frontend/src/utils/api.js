/**
 * API Utility
 *
 * Centralized API client. Uses VITE_API_URL in production (Vercel → Render)
 * and empty string in development (Vite proxy handles /api → localhost:3001).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Sends a POST request to the summarize endpoint.
 * Timeout set to 120s to handle Render free tier cold starts.
 *
 * @param {string} url - YouTube video URL
 * @param {string} level - Summary level: "short", "medium", or "detailed"
 * @returns {Promise<Object>} The summary response data
 */
export async function summarizeVideo(url, level = "medium") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000); // 2 min timeout

  try {
    const response = await fetch(`${API_BASE_URL}/api/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, level }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. The server may be starting up — please try again in 30 seconds.");
    }
    if (err.message === "Failed to fetch") {
      throw new Error("Cannot reach the server. Please check your connection and try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
