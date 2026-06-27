/**
 * Summarize Controller
 *
 * Orchestrates the summarization flow:
 * 1. Validate URL and options (level)
 * 2. Fetch transcript with segments
 * 3. Generate AI summary at requested level
 * 4. Return structured response including transcript
 */

import { getTranscriptWithSegments } from "../services/transcript.service.js";
import { generateSummary } from "../services/gemini.service.js";
import { AppError } from "../utils/appError.js";

const VALID_LEVELS = ["short", "medium", "detailed"];

/**
 * POST /api/summarize
 * Body: { url: string, level?: "short" | "medium" | "detailed" }
 */
export async function summarizeVideo(req, res, next) {
  try {
    const { url, level = "medium" } = req.body;

    // Validate URL
    if (!url || typeof url !== "string" || !url.trim()) {
      throw new AppError("Please provide a valid YouTube URL.", 400);
    }

    // Validate level
    const summaryLevel = VALID_LEVELS.includes(level) ? level : "medium";

    // Fetch transcript
    const { text, segments } = await getTranscriptWithSegments(url.trim());

    // Generate summary at the requested level
    const result = await generateSummary(segments, summaryLevel);

    // Return full response including transcript for the viewer
    return res.json({
      title: result.title,
      shortSummary: result.shortSummary,
      detailedSummary: result.detailedSummary,
      keyPoints: result.keyPoints,
      timestamps: result.timestamps,
      actionItems: result.actionItems,
      quotes: result.quotes,
      faqs: result.faqs,
      transcript: segments.map((s) => ({
        text: s.text,
        offset: s.offset,
        duration: s.duration,
      })),
    });
  } catch (error) {
    next(error);
  }
}
