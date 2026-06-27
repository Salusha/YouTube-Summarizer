/**
 * Gemini AI Service
 *
 * Integrates with Google's Gemini 2.5 Flash model to generate structured
 * video summaries. Supports three summary levels (short, medium, detailed)
 * and extracts: title, summary, key points, timestamps, action items,
 * important quotes, and FAQs.
 *
 * Includes retry logic with exponential backoff for transient failures.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "../utils/appError.js";
import { formatTimestamp } from "../utils/time.util.js";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;
const MAX_TRANSCRIPT_LENGTH = 80000;
const TEMPERATURE = 0.2;

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM INSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `You are a professional content analyst. Your task is to analyze YouTube video transcripts and extract structured information. You respond ONLY in valid JSON. You never include markdown, code fences, explanations, or any text outside the JSON object.

CRITICAL LANGUAGE RULE: ALL output MUST be in English regardless of the transcript language. If the transcript is in Hindi, Spanish, French, or any other language, you MUST translate everything to English. Never output non-English text in any field including quotes. Translate quotes to English.`;

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT TEMPLATES BY LEVEL
// ─────────────────────────────────────────────────────────────────────────────

function buildPrompt(level) {
  const levelConfig = {
    short: {
      summaryWords: "50-80 words",
      detailedWords: "100-150 words",
      keyPointsCount: 5,
      timestampsMin: 3,
    },
    medium: {
      summaryWords: "100 words",
      detailedWords: "300-500 words",
      keyPointsCount: 10,
      timestampsMin: 5,
    },
    detailed: {
      summaryWords: "150 words",
      detailedWords: "500-800 words",
      keyPointsCount: 15,
      timestampsMin: 8,
    },
  };

  const config = levelConfig[level] || levelConfig.medium;

  return `Analyze the following YouTube video transcript and return a JSON object with this exact schema:

{
  "title": "",
  "shortSummary": "",
  "detailedSummary": "",
  "keyPoints": [""],
  "timestamps": [{"time": "", "description": ""}],
  "actionItems": [""],
  "quotes": [""],
  "faqs": [{"question": "", "answer": ""}]
}

Field requirements:

title
- A concise, descriptive title for the video content
- Reflect the actual topic accurately

shortSummary
- ${config.summaryWords}
- Capture the core message and purpose of the video

detailedSummary
- ${config.detailedWords}
- Cover all major topics, arguments, examples, and conclusions
- Maintain logical flow

keyPoints
- Up to ${config.keyPointsCount} key points (fewer is fine if the video is short)
- Each must be a single, complete, meaningful sentence
- Never return empty strings
- If the video only has 3 meaningful points, return only 3
- Each must be a single, self-contained sentence
- Extract the most important ideas accurately

timestamps
- Mark every major topic transition across the ENTIRE video duration
- Use the time markers from the transcript (format: M:SS or H:MM:SS)
- Minimum ${config.timestampsMin} timestamps spread across the full video length
- Cover beginning, middle, and end of the video proportionally
- Each has "time" and "description" fields
- Descriptions should be concise (under 10 words)

actionItems
- Extract specific actions, recommendations, or advice
- Each item should be actionable and clearly stated
- If no actionable content exists, return an empty array []

quotes
- Extract 3-5 notable or impactful quotes from the speaker
- TRANSLATE all quotes to English if the original is in another language
- Choose quotes that are insightful, memorable, or summarize key ideas
- If no notable quotes exist, return an empty array []

faqs
- Generate 3-5 frequently asked questions that a viewer might have after watching
- Each FAQ has a "question" and a concise "answer" based on the transcript content
- Questions should address key concepts, clarifications, or practical applications

Rules:
- Return ONLY the JSON object
- Do not wrap in code fences
- ALL output MUST be in English - translate any non-English content
- If the transcript is in Hindi or any other language, translate everything to English
- Quotes must also be translated to English
- Be concise but informative
- Extract important ideas accurately
- Timestamps must cover the full duration of the video, not just the beginning`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a structured summary from transcript segments.
 *
 * @param {Array<{text: string, offset: number}>} segments - Transcript segments
 * @param {string} level - Summary level: "short", "medium", or "detailed"
 * @returns {Promise<Object>} Structured summary object
 * @throws {AppError} If all retries are exhausted or non-retryable error occurs
 */
export async function generateSummary(segments, level = "medium") {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("GEMINI_API_KEY is not configured. Set it in your .env file.", 500);
  }

  const transcriptText = buildTranscriptText(segments);
  const analysisPrompt = buildPrompt(level);
  const prompt = `${analysisPrompt}\n\n--- TRANSCRIPT ---\n${transcriptText}\n--- END TRANSCRIPT ---`;

  const responseText = await callGeminiWithRetry(prompt);
  return parseResponse(responseText);
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function buildTranscriptText(segments) {
  const formatted = segments
    .map((s) => `[${formatTimestamp(s.offset)}] ${s.text}`)
    .join("\n");

  // If transcript fits within limit, use it all
  if (formatted.length <= MAX_TRANSCRIPT_LENGTH) {
    return formatted;
  }

  // For long videos: smart sampling from beginning, middle, and end
  // Take a fixed number of segments per chunk (not proportional to video length)
  const totalSegments = segments.length;
  const SEGMENTS_PER_CHUNK = 200; // ~200 segments ≈ 10-15 minutes of content per sample

  // Sample 5 evenly-spaced chunks across the full video
  const samplePoints = [0, 0.2, 0.4, 0.65, 0.85];
  const labels = ["BEGINNING", "EARLY-MIDDLE", "MIDDLE", "LATE-MIDDLE", "END"];

  // Get total video duration for context
  const lastSegment = segments[segments.length - 1];
  const totalDuration = formatTimestamp(lastSegment.offset + (lastSegment.duration || 0));

  let sampled = `[NOTE: This is a long video (total duration: ${totalDuration}). Transcript is sampled from 5 sections spread across the ENTIRE video. You MUST generate timestamps covering the full duration from 0:00 to ${totalDuration}, not just the sampled sections.]\n\n`;

  for (let i = 0; i < samplePoints.length; i++) {
    const startIdx = Math.min(
      Math.floor(totalSegments * samplePoints[i]),
      totalSegments - SEGMENTS_PER_CHUNK
    );
    const endIdx = Math.min(startIdx + SEGMENTS_PER_CHUNK, totalSegments);
    const chunkSegments = segments.slice(startIdx, endIdx);

    const startTime = formatTimestamp(chunkSegments[0]?.offset || 0);
    const endTime = formatTimestamp(chunkSegments[chunkSegments.length - 1]?.offset || 0);

    sampled += `--- ${labels[i]} (${startTime} to ${endTime}) ---\n`;
    sampled += chunkSegments.map((s) => `[${formatTimestamp(s.offset)}] ${s.text}`).join("\n");
    sampled += "\n\n";
  }

  // Final trim safety (should rarely trigger now)
  if (sampled.length > MAX_TRANSCRIPT_LENGTH) {
    return sampled.slice(0, MAX_TRANSCRIPT_LENGTH) + "\n\n[...trimmed...]";
  }

  return sampled;
}

async function callGeminiWithRetry(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: TEMPERATURE,
      topP: 0.8,
      maxOutputTokens: 8192,
    },
  });

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("EMPTY_RESPONSE");
      }

      return text;
    } catch (error) {
      lastError = error;
      const classification = classifyError(error);

      if (!classification.retryable) {
        throw classification.appError;
      }

      console.warn(`[GeminiService] Attempt ${attempt}/${MAX_RETRIES} failed: ${error.message.substring(0, 100)}. Retrying...`);

      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }
  }

  console.error(`[GeminiService] All ${MAX_RETRIES} attempts failed.`);
  throw new AppError("Failed to generate summary after multiple attempts. Please try again later.", 502);
}

function classifyError(error) {
  const message = (error.message || "").toLowerCase();
  const status = error.status || error.statusCode || 0;

  if (message.includes("api key") || message.includes("unauthorized") || status === 401) {
    return { retryable: false, appError: new AppError("Invalid Gemini API key. Check your .env file.", 401) };
  }
  if (message.includes("safety") || message.includes("blocked")) {
    return { retryable: false, appError: new AppError("Content blocked by safety filters.", 400) };
  }
  if (message.includes("not found") || message.includes("invalid model") || status === 404) {
    return { retryable: false, appError: new AppError("AI model configuration error.", 500) };
  }
  if (message.includes("quota") || message.includes("rate") || message.includes("429") || status === 429) {
    return { retryable: true, appError: new AppError("API rate limit exceeded. Try again in a moment.", 429) };
  }
  if (message.includes("timeout") || message.includes("network") || message.includes("fetch failed")) {
    return { retryable: true, appError: new AppError("Network error connecting to AI service.", 503) };
  }
  if (message === "empty_response") {
    return { retryable: true, appError: new AppError("AI returned an empty response.", 502) };
  }

  return { retryable: true, appError: new AppError("Unexpected error during summarization.", 502) };
}

function parseResponse(text) {
  let cleaned = text.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?\s*```$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);
    return normalizeResult(parsed);
  } catch {
    // Attempt to repair truncated JSON
    console.warn("[GeminiService] JSON parse failed, attempting repair...");
    const repaired = repairTruncatedJson(cleaned);
    if (repaired) return repaired;

    // Last resort: regex extraction
    return extractFromRawText(cleaned);
  }
}

function normalizeResult(parsed) {
  return {
    title: parsed.title?.trim() || "Video Summary",
    shortSummary: parsed.shortSummary?.trim() || "No summary available.",
    detailedSummary: parsed.detailedSummary?.trim() || "",
    keyPoints: Array.isArray(parsed.keyPoints)
      ? parsed.keyPoints.filter((p) => typeof p === "string" && p.trim().length > 5)
      : [],
    timestamps: Array.isArray(parsed.timestamps)
      ? parsed.timestamps
          .filter((t) => t && typeof t.time === "string" && t.time.trim() && typeof t.description === "string" && t.description.trim().length > 2)
          .map((t) => ({ time: t.time.trim(), description: t.description.trim() }))
      : [],
    actionItems: Array.isArray(parsed.actionItems)
      ? parsed.actionItems.filter((a) => typeof a === "string" && a.trim().length > 5)
      : [],
    quotes: Array.isArray(parsed.quotes)
      ? parsed.quotes.filter((q) => typeof q === "string" && q.trim().length > 10)
      : [],
    faqs: Array.isArray(parsed.faqs)
      ? parsed.faqs
          .filter((f) => f && typeof f.question === "string" && f.question.trim() && typeof f.answer === "string" && f.answer.trim())
          .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
      : [],
  };
}

function repairTruncatedJson(text) {
  try {
    let repaired = text.trim();
    const lastValidComma = repaired.lastIndexOf('",');
    const lastValidBrace = repaired.lastIndexOf('"}');
    const lastValidBracket = repaired.lastIndexOf('"]');
    const lastComplete = Math.max(lastValidComma, lastValidBrace, lastValidBracket);

    if (lastComplete > repaired.length * 0.5) {
      repaired = repaired.substring(0, lastComplete + 2);
    }

    const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) repaired += '"';

    const openBrackets = (repaired.match(/\[/g) || []).length - (repaired.match(/\]/g) || []).length;
    const openBraces = (repaired.match(/\{/g) || []).length - (repaired.match(/\}/g) || []).length;

    for (let i = 0; i < openBrackets; i++) repaired += "]";
    for (let i = 0; i < openBraces; i++) repaired += "}";

    const parsed = JSON.parse(repaired);
    if (parsed.title || parsed.shortSummary) {
      console.log("[GeminiService] Successfully repaired truncated JSON");
      return normalizeResult(parsed);
    }
    return null;
  } catch {
    return null;
  }
}

function extractFromRawText(text) {
  const title = text.match(/"title"\s*:\s*"([^"]+)"/)?.[1] || "Video Summary";
  const shortSummary = text.match(/"shortSummary"\s*:\s*"([\s\S]*?)(?:"\s*[,}])/)?.[1]?.replace(/\\n/g, "\n") || "";
  const detailedSummary = text.match(/"detailedSummary"\s*:\s*"([\s\S]*?)(?:"\s*[,}])/)?.[1]?.replace(/\\n/g, "\n") || "";

  const keyPoints = [];
  const kpMatch = text.match(/"keyPoints"\s*:\s*\[([\s\S]*?)(?:\]|$)/);
  if (kpMatch) {
    const points = kpMatch[1].match(/"([^"]+)"/g);
    if (points) points.forEach((p) => keyPoints.push(p.replace(/"/g, "")));
  }

  return {
    title, shortSummary, detailedSummary, keyPoints,
    timestamps: [], actionItems: [], quotes: [], faqs: [],
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
