/**
 * UrlForm Component
 *
 * Input form with URL field, summary level selector, and submit button.
 */

import { useState } from "react";

const LEVELS = [
  { value: "short", label: "Short", desc: "Quick overview" },
  { value: "medium", label: "Medium", desc: "Balanced summary" },
  { value: "detailed", label: "Detailed", desc: "In-depth analysis" },
];

function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");
  const [level, setLevel] = useState("medium");

  function handleSubmit(e) {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), level);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* URL input */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            required
            disabled={loading}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all disabled:opacity-50"
            aria-label="YouTube video URL"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-primary-600/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Processing..." : "Summarize"}
        </button>
      </div>

      {/* Summary level selector */}
      <div className="flex items-center justify-center gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            type="button"
            onClick={() => setLevel(l.value)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              level === l.value
                ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/30"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            } disabled:opacity-50`}
            title={l.desc}
          >
            {l.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-sm text-gray-400 dark:text-gray-500">
        Supports youtube.com, youtu.be, and Shorts links
      </p>
    </form>
  );
}

export default UrlForm;
