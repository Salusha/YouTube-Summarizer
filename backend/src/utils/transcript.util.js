/**
 * Transcript Utility Functions
 *
 * Reusable helpers for cleaning, formatting, and processing
 * raw transcript segments from YouTube videos.
 */

/**
 * Decodes common HTML entities found in YouTube transcripts.
 * YouTube often returns text with encoded characters.
 *
 * @param {string} text - Raw text that may contain HTML entities
 * @returns {string} Decoded plain text
 *
 * @example
 * decodeHtmlEntities("I&#39;m here &amp; ready") // "I'm here & ready"
 */
export function decodeHtmlEntities(text) {
  if (!text) return "";

  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
}

/**
 * Removes common filler annotations and noise from transcript text.
 * YouTube auto-generated captions often include [Music], [Applause], etc.
 *
 * @param {string} text - Transcript segment text
 * @returns {string} Cleaned text without annotations
 *
 * @example
 * removeAnnotations("[Music] Hello everyone") // "Hello everyone"
 */
export function removeAnnotations(text) {
  if (!text) return "";

  // Remove bracketed annotations like [Music], [Applause], [Laughter]
  return text
    .replace(/\[.*?\]/g, "")
    .replace(/\(.*?\)/g, "")
    .trim();
}

/**
 * Normalizes whitespace in text by collapsing multiple spaces
 * and trimming leading/trailing whitespace.
 *
 * @param {string} text - Text with potential irregular spacing
 * @returns {string} Text with normalized single spaces
 */
export function normalizeWhitespace(text) {
  if (!text) return "";

  return text.replace(/\s+/g, " ").trim();
}

/**
 * Processes a single transcript segment by decoding entities,
 * removing annotations, and normalizing whitespace.
 *
 * @param {string} rawText - Raw segment text from YouTube
 * @returns {string} Cleaned, readable text
 */
export function cleanSegmentText(rawText) {
  if (!rawText) return "";

  let cleaned = rawText;
  cleaned = decodeHtmlEntities(cleaned);
  cleaned = removeAnnotations(cleaned);
  cleaned = normalizeWhitespace(cleaned);

  return cleaned;
}

/**
 * Joins an array of transcript segments into a single clean string.
 * Filters out empty segments and joins with spaces.
 *
 * @param {Array<{text: string}>} segments - Raw transcript segments
 * @returns {string} Single joined transcript string
 */
export function joinSegments(segments) {
  if (!segments || !Array.isArray(segments) || segments.length === 0) {
    return "";
  }

  return segments
    .map((segment) => cleanSegmentText(segment.text))
    .filter((text) => text.length > 0) // Remove empty segments
    .join(" ");
}
