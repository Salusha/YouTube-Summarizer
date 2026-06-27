/**
 * PdfExportButton Component
 *
 * Generates a professionally formatted PDF containing:
 * - Video title
 * - Summary text
 * - Key points (numbered list)
 * - Timestamps (time + description)
 *
 * Uses jsPDF for client-side PDF generation.
 * Filename: video-summary.pdf
 */

import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PDF LAYOUT CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const MARGIN_TOP = 25;
const MARGIN_BOTTOM = 25;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const LINE_HEIGHT = 6;
const SECTION_GAP = 12;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function PdfExportButton({ data }) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    if (!data) return;

    setExporting(true);

    try {
      // Dynamic import keeps jsPDF out of the initial bundle
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let y = MARGIN_TOP;

      // ─── HEADER BAR ───────────────────────────────────────────────────
      doc.setFillColor(37, 99, 235); // primary-600 blue
      doc.rect(0, 0, PAGE_WIDTH, 12, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("YouTube Video Summary", MARGIN_LEFT, 8);
      doc.setTextColor(200, 220, 255);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleDateString(), PAGE_WIDTH - MARGIN_RIGHT, 8, { align: "right" });

      y = 20;

      // ─── TITLE ────────────────────────────────────────────────────────
      doc.setTextColor(17, 24, 39); // gray-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(data.title || "Video Summary", CONTENT_WIDTH);
      y = addTextWithPageBreak(doc, titleLines, MARGIN_LEFT, y, 8);
      y += 4;

      // ─── SUMMARY SECTION ──────────────────────────────────────────────
      y = addSectionHeader(doc, "Summary", y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81); // gray-700

      const summaryText = data.shortSummary || data.detailedSummary || "";
      const summaryLines = doc.splitTextToSize(summaryText, CONTENT_WIDTH);
      y = addTextWithPageBreak(doc, summaryLines, MARGIN_LEFT, y, LINE_HEIGHT);

      // If detailed summary exists and is different from short summary, add it
      if (data.detailedSummary && data.detailedSummary !== data.shortSummary) {
        y += 4;
        const detailedLines = doc.splitTextToSize(data.detailedSummary, CONTENT_WIDTH);
        y = addTextWithPageBreak(doc, detailedLines, MARGIN_LEFT, y, LINE_HEIGHT);
      }

      y += SECTION_GAP;

      // ─── KEY POINTS SECTION ───────────────────────────────────────────
      if (data.keyPoints && data.keyPoints.length > 0) {
        y = checkPageBreak(doc, y, 30);
        y = addSectionHeader(doc, "Key Points", y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);

        for (let i = 0; i < data.keyPoints.length; i++) {
          const point = data.keyPoints[i];
          const bulletText = `${i + 1}.  ${point}`;
          const pointLines = doc.splitTextToSize(bulletText, CONTENT_WIDTH - 5);

          y = checkPageBreak(doc, y, pointLines.length * LINE_HEIGHT + 2);

          // Number highlight
          doc.setFont("helvetica", "bold");
          doc.setTextColor(37, 99, 235);
          doc.text(`${i + 1}.`, MARGIN_LEFT, y);

          // Point text
          doc.setFont("helvetica", "normal");
          doc.setTextColor(55, 65, 81);
          const textLines = doc.splitTextToSize(point, CONTENT_WIDTH - 10);
          y = addTextWithPageBreak(doc, textLines, MARGIN_LEFT + 10, y, LINE_HEIGHT);
          y += 2;
        }

        y += SECTION_GAP - 2;
      }

      // ─── TIMESTAMPS SECTION ───────────────────────────────────────────
      if (data.timestamps && data.timestamps.length > 0) {
        y = checkPageBreak(doc, y, 30);
        y = addSectionHeader(doc, "Timestamps", y);

        doc.setFontSize(10);

        for (let i = 0; i < data.timestamps.length; i++) {
          const ts = data.timestamps[i];
          y = checkPageBreak(doc, y, LINE_HEIGHT + 4);

          // Time badge background
          doc.setFillColor(239, 246, 255); // primary-50
          doc.roundedRect(MARGIN_LEFT, y - 4, 18, 6, 1, 1, "F");

          // Time text
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(37, 99, 235);
          doc.text(ts.time || "", MARGIN_LEFT + 2, y);

          // Description text
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(55, 65, 81);
          const desc = ts.description || ts.topic || "";
          doc.text(desc, MARGIN_LEFT + 22, y);

          y += LINE_HEIGHT + 2;
        }

        y += SECTION_GAP;
      }

      // ─── FOOTER ON LAST PAGE ──────────────────────────────────────────
      addFooter(doc);

      // ─── SAVE ─────────────────────────────────────────────────────────
      doc.save("video-summary.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50"
      title="Export as PDF"
    >
      {exporting ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>PDF</span>
        </>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Adds a styled section header (blue left border + bold text).
 */
function addSectionHeader(doc, title, y) {
  y = checkPageBreak(doc, y, 14);

  // Blue left accent bar
  doc.setFillColor(37, 99, 235);
  doc.rect(MARGIN_LEFT, y - 4, 2, 7, "F");

  // Section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text(title, MARGIN_LEFT + 6, y);

  return y + 10;
}

/**
 * Writes lines of text, adding page breaks when needed.
 */
function addTextWithPageBreak(doc, lines, x, startY, lineHeight) {
  let y = startY;

  for (const line of lines) {
    y = checkPageBreak(doc, y, lineHeight);
    doc.text(line, x, y);
    y += lineHeight;
  }

  return y;
}

/**
 * Checks if content will overflow the page. If so, adds a new page.
 */
function checkPageBreak(doc, y, requiredSpace) {
  if (y + requiredSpace > PAGE_HEIGHT - MARGIN_BOTTOM) {
    doc.addPage();
    addFooter(doc);
    return MARGIN_TOP;
  }
  return y;
}

/**
 * Adds a subtle footer line to the current page.
 */
function addFooter(doc) {
  const pageCount = doc.getNumberOfPages();
  doc.setPage(pageCount);
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated by YouTube Summarizer — Page ${pageCount}`,
    PAGE_WIDTH / 2,
    PAGE_HEIGHT - 10,
    { align: "center" }
  );
}

export default PdfExportButton;
