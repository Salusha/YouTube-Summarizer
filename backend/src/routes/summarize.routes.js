/**
 * Summarize Routes
 *
 * Defines the POST /api/summarize endpoint.
 * Delegates request handling to the summarize controller.
 */

import { Router } from "express";
import { summarizeVideo } from "../controllers/summarize.controller.js";

const router = Router();

/**
 * POST /api/summarize
 *
 * Request body: { url: "https://youtube.com/watch?v=..." }
 * Response:     { title, summary, keyPoints, timestamps }
 */
router.post("/summarize", summarizeVideo);

export default router;
