/**
 * ActionItems Component - Dark mode ready
 */

function ActionItems({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Action Items</h3>
      </div>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <svg className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActionItems;
