/**
 * API Utility
 *
 * Centralized API configuration for the backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Sends a POST request to the summarize endpoint.
 *
 * @param {string} url - YouTube video URL
 * @param {string} level - Summary level: "short", "medium", or "detailed"
 * @returns {Promise<Object>} The summary response data
 */
export async function summarizeVideo(url, level = "medium") {
  const response = await fetch(`${API_BASE_URL}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, level }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}
