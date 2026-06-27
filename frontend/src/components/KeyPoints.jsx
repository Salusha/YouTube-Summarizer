/**
 * KeyPoints Component - Dark mode ready
 */

function KeyPoints({ points }) {
  if (!points || points.length === 0) return null;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Points</h3>
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{points.length} points</span>
      </div>

      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KeyPoints;
