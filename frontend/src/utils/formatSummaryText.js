/**
 * Formats the full summary data into a clean plain-text string
 * suitable for clipboard copying.
 *
 * Includes: title, summary, key points, and timestamps.
 *
 * @param {Object} data - The summary result object from the API
 * @param {string} data.title
 * @param {string} data.shortSummary
 * @param {string} data.detailedSummary
 * @param {string[]} data.keyPoints
 * @param {Array<{time: string, description: string}>} data.timestamps
 * @param {string[]} data.actionItems
 * @returns {string} Formatted plain text
 */
export function formatSummaryText(data) {
  if (!data) return "";

  const sections = [];

  // ─── Title ────────────────────────────────────────
  sections.push(data.title || "Video Summary");
  sections.push("═".repeat(50));

  // ─── Summary ──────────────────────────────────────
  if (data.shortSummary) {
    sections.push("");
    sections.push("SUMMARY");
    sections.push("─".repeat(30));
    sections.push(data.shortSummary);
  }

  if (data.detailedSummary) {
    sections.push("");
    sections.push(data.detailedSummary);
  }

  // ─── Key Points ───────────────────────────────────
  if (data.keyPoints && data.keyPoints.length > 0) {
    sections.push("");
    sections.push("KEY POINTS");
    sections.push("─".repeat(30));
    data.keyPoints.forEach((point, i) => {
      sections.push(`${i + 1}. ${point}`);
    });
  }

  // ─── Timestamps ───────────────────────────────────
  if (data.timestamps && data.timestamps.length > 0) {
    sections.push("");
    sections.push("TIMESTAMPS");
    sections.push("─".repeat(30));
    data.timestamps.forEach((ts) => {
      const desc = ts.description || ts.topic || "";
      sections.push(`[${ts.time}] ${desc}`);
    });
  }

  // ─── Action Items ─────────────────────────────────
  if (data.actionItems && data.actionItems.length > 0) {
    sections.push("");
    sections.push("ACTION ITEMS");
    sections.push("─".repeat(30));
    data.actionItems.forEach((item) => {
      sections.push(`• ${item}`);
    });
  }

  return sections.join("\n");
}
