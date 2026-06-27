/**
 * SummaryCard Component
 *
 * Displays title, short summary, expandable detailed summary.
 * Includes Copy and PDF Export buttons.
 */

import { useState } from "react";
import CopyButton from "./CopyButton.jsx";
import PdfExportButton from "./PdfExportButton.jsx";
import { formatSummaryText } from "../utils/formatSummaryText.js";

function SummaryCard({ title, shortSummary, detailedSummary, data, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  const fullText = formatSummaryText(data);

  return (
    <div className="card animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
            Summary
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <CopyButton text={fullText} onCopy={onCopy} />
          <PdfExportButton data={data} />
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{shortSummary}</p>

      {detailedSummary && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            {expanded ? "Show less" : "Read detailed summary"}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expanded && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line animate-fade-in">
              {detailedSummary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SummaryCard;
