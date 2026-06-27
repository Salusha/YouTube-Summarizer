/**
 * ErrorMessage Component - Dark mode ready
 */

function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="max-w-2xl mx-auto mt-6 animate-fade-in" role="alert">
      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="flex-1 text-sm text-red-700 dark:text-red-300">{message}</p>
        {onDismiss && (
          <button onClick={onDismiss} className="text-red-400 hover:text-red-600 dark:hover:text-red-300" aria-label="Dismiss">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
