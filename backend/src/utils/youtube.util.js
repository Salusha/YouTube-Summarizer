/**
 * YouTube Utility Functions
 *
 * Helpers for parsing and validating YouTube URLs.
 * Supports all common YouTube URL formats.
 */

/**
 * Regular expressions for supported YouTube URL patterns.
 * Each captures the 11-character video ID.
 */
const YOUTUBE_PATTERNS = [
  // Standard: youtube.com/watch?v=VIDEO_ID (handles extra params)
  /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
  // Short: youtu.be/VIDEO_ID
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  // Embed: youtube.com/embed/VIDEO_ID
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  // Old embed: youtube.com/v/VIDEO_ID
  /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  // Shorts: youtube.com/shorts/VIDEO_ID
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  // Live: youtube.com/live/VIDEO_ID
  /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
];

/**
 * Extracts the video ID from a YouTube URL.
 *
 * @param {string} url - The YouTube URL to parse
 * @returns {string|null} The 11-character video ID, or null if invalid
 *
 * @example
 * extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ") // "dQw4w9WgXcQ"
 * extractVideoId("https://youtu.be/dQw4w9WgXcQ")                // "dQw4w9WgXcQ"
 * extractVideoId("not a youtube url")                            // null
 */
export function extractVideoId(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  // Try each pattern until we find a match
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
