/**
 * Time Utility Functions
 *
 * Helpers for formatting time values used in transcript processing.
 */

/**
 * Converts a millisecond offset to a human-readable timestamp string.
 *
 * @param {number} offsetMs - Time offset in milliseconds
 * @returns {string} Formatted timestamp (M:SS or H:MM:SS)
 *
 * @example
 * formatTimestamp(0)       // "0:00"
 * formatTimestamp(65000)   // "1:05"
 * formatTimestamp(3661000) // "1:01:01"
 */
export function formatTimestamp(offsetMs) {
  // Convert milliseconds to total seconds
  const totalSeconds = Math.floor(offsetMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format with leading zeros on seconds
  const paddedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}
