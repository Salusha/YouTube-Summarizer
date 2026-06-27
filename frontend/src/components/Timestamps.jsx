/**
 * Timestamps Component - Dark mode ready
 */

function Timestamps({ timestamps }) {
  if (!timestamps || timestamps.length === 0) return null;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Timestamps</h3>
      </div>

      <div className="relative">
        <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
        <div className="space-y-3">
          {timestamps.map((item, index) => (
            <div key={index} className="flex items-start gap-4 relative">
              <div className="flex-shrink-0 w-[48px] flex items-center justify-center relative z-10">
                <div className="w-3 h-3 bg-primary-500 rounded-full ring-4 ring-primary-50 dark:ring-primary-900/40"></div>
              </div>
              <div className="flex items-baseline gap-3 flex-1 pb-1">
                <span className="font-mono text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
                  {item.time}
                </span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timestamps;
