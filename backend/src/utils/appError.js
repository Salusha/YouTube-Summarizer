/**
 * Custom Application Error Class
 *
 * Extends the native Error class to include an HTTP status code.
 * Used throughout the app for consistent, informative error responses.
 */

export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (400, 404, 500, etc.)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";

    // Maintain proper stack trace (only available on V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
