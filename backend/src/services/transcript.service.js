/**
 * Transcript Service
 *
 * Provides a clean interface for fetching YouTube video transcripts.
 * Accepts a YouTube URL, extracts the video ID, fetches the transcript,
 * and returns clean, joined text ready for processing.
 *
 * Handles all common error scenarios:
 * - Invalid or missing URLs
 * - Private videos
 * - Age-restricted videos
 * - Videos with disabled transcripts
 * - Videos not found
 * - Network and server errors
 */

import { YoutubeTranscript } from "youtube-transcript";
import { AppError } from "../utils/appError.js";
import { extractVideoId } from "../utils/youtube.util.js";
import { joinSegments, cleanSegmentText } from "../utils/transcript.util.js";

/**
 * Fetches and returns the full transcript text for a YouTube video URL.
 *
 * This is the main entry point for the transcript service.
 * It validates the URL, extracts the video ID, fetches the transcript,
 * cleans the text, and returns a single joined string.
 *
 * @param {string} url - A valid YouTube video URL
 * @returns {Promise<string>} Clean transcript text as a single string
 * @throws {AppError} With appropriate status codes for different failure types
 *
 * @example
 * const text = await getTranscript("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
 * console.log(text); // "We're no strangers to love You know the rules..."
 */
export async function getTranscript(url) {
  // Step 1: Validate the input URL
  validateUrl(url);

  // Step 2: Extract the video ID from the URL
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new AppError(
      "Invalid YouTube URL. Supported formats: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/",
      400
    );
  }

  // Step 3: Fetch the raw transcript segments
  const segments = await fetchRawTranscript(videoId);

  // Step 4: Join and clean segments into a single string
  const transcript = joinSegments(segments);

  // Step 5: Validate the resulting transcript has enough content
  if (!transcript || transcript.length < 50) {
    throw new AppError(
      "The transcript is too short to generate a meaningful summary.",
      422
    );
  }

  return transcript;
}

/**
 * Fetches raw transcript segments for a video ID.
 * Returns the unprocessed segment array with text, offset, and duration.
 *
 * Useful when you need access to timing information (e.g., for timestamps).
 *
 * @param {string} videoId - The 11-character YouTube video ID
 * @returns {Promise<Array<{text: string, offset: number, duration: number}>>}
 * @throws {AppError} With descriptive error for each failure type
 */
export async function fetchTranscriptSegments(videoId) {
  if (!videoId || typeof videoId !== "string") {
    throw new AppError("A valid video ID is required.", 400);
  }

  return fetchRawTranscript(videoId);
}

/**
 * Fetches the transcript and returns both the joined text and raw segments.
 * Combines the functionality of getTranscript and fetchTranscriptSegments.
 *
 * @param {string} url - A valid YouTube video URL
 * @returns {Promise<{text: string, segments: Array<{text: string, offset: number, duration: number}>}>}
 * @throws {AppError} With appropriate status codes for different failure types
 */
export async function getTranscriptWithSegments(url) {
  // Validate and extract video ID
  validateUrl(url);
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new AppError(
      "Invalid YouTube URL. Supported formats: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/",
      400
    );
  }

  // Fetch raw segments
  const segments = await fetchRawTranscript(videoId);

  // Clean and join
  const text = joinSegments(segments);

  if (!text || text.length < 50) {
    throw new AppError(
      "The transcript is too short to generate a meaningful summary.",
      422
    );
  }

  return { text, segments };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates that the input is a non-empty string URL.
 *
 * @param {*} url - The value to validate
 * @throws {AppError} If URL is missing or not a string
 */
function validateUrl(url) {
  if (!url || typeof url !== "string" || !url.trim()) {
    throw new AppError("A YouTube URL is required.", 400);
  }
}

/**
 * Core function that fetches raw transcript segments from YouTube.
 * Contains all error classification logic for different failure types.
 *
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<Array>} Raw transcript segments
 * @throws {AppError} Classified error with appropriate HTTP status
 */
async function fetchRawTranscript(videoId) {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);

    // Handle empty transcript response
    if (!segments || segments.length === 0) {
      throw new AppError(
        "No transcript available for this video. The video may not have captions or subtitles enabled.",
        404
      );
    }

    return segments;
  } catch (error) {
    // Re-throw our own AppErrors without modification
    if (error instanceof AppError) {
      throw error;
    }

    // Classify the error based on the message from youtube-transcript
    const message = (error.message || "").toLowerCase();

    // Private video errors
    if (message.includes("private") || message.includes("sign in")) {
      throw new AppError(
        "This video is private. Transcripts can only be fetched from public or unlisted videos.",
        403
      );
    }

    // Age-restricted video errors
    if (
      message.includes("age") ||
      message.includes("restricted") ||
      message.includes("login required") ||
      message.includes("confirm your age")
    ) {
      throw new AppError(
        "This video is age-restricted. Transcripts cannot be fetched for age-restricted content.",
        403
      );
    }

    // Transcript disabled by uploader
    if (
      message.includes("disabled") ||
      message.includes("transcript is disabled") ||
      message.includes("subtitles are disabled")
    ) {
      throw new AppError(
        "Transcripts are disabled for this video by the content creator.",
        403
      );
    }

    // Video not found / removed / unavailable
    if (
      message.includes("not found") ||
      message.includes("404") ||
      message.includes("unavailable") ||
      message.includes("removed") ||
      message.includes("does not exist")
    ) {
      throw new AppError(
        "Video not found. It may have been removed or the URL is incorrect.",
        404
      );
    }

    // Live stream with no transcript
    if (message.includes("live") || message.includes("premiere")) {
      throw new AppError(
        "Transcripts are not available for live streams or upcoming premieres.",
        404
      );
    }

    // Network or timeout errors
    if (
      message.includes("network") ||
      message.includes("timeout") ||
      message.includes("ECONNREFUSED") ||
      message.includes("ETIMEDOUT")
    ) {
      throw new AppError(
        "Network error while fetching the transcript. Please check your connection and try again.",
        503
      );
    }

    // Rate limiting from YouTube
    if (
      message.includes("too many requests") ||
      message.includes("429") ||
      message.includes("rate")
    ) {
      throw new AppError(
        "Too many requests to YouTube. Please wait a moment and try again.",
        429
      );
    }

    // Fallback: unrecognized error
    console.error(`[TranscriptService] Unhandled error for video ${videoId}:`, error.message);
    throw new AppError(
      "Failed to fetch the video transcript. Please try again later.",
      502
    );
  }
}
