/**
 * Quotes Component
 *
 * Displays notable quotes from the video in a styled card.
 */

function Quotes({ quotes }) {
  if (!quotes || quotes.length === 0) return null;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notable Quotes</h3>
      </div>

      <div className="space-y-3">
        {quotes.map((quote, index) => (
          <blockquote
            key={index}
            className="border-l-3 border-indigo-400 dark:border-indigo-500 pl-4 py-2"
            style={{ borderLeftWidth: "3px" }}
          >
            <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>
        ))}
      </div>
    </div>
  );
}

export default Quotes;
