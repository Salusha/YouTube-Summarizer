/**
 * Toast Component
 *
 * A floating notification that auto-dismisses after a set duration.
 * Supports success and error variants with icons and animations.
 */

import { useEffect, useState } from "react";

/**
 * @param {Object} props
 * @param {string} props.message - Text to display
 * @param {"success"|"error"} props.type - Toast variant
 * @param {number} [props.duration=3000] - Auto-dismiss time in ms
 * @param {Function} props.onClose - Called when toast dismisses
 */
function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Animate in on mount
  useEffect(() => {
    // Small delay to trigger CSS transition
    const showTimer = setTimeout(() => setVisible(true), 10);

    // Auto-dismiss after duration
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration]);

  function handleClose() {
    setExiting(true);
    setVisible(false);
    // Wait for exit animation before removing from DOM
    setTimeout(() => {
      onClose?.();
    }, 300);
  }

  // Icon based on type
  const icon =
    type === "success" ? (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );

  // Background color based on type
  const bgClass = type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  const textClass = type === "success" ? "text-green-800" : "text-red-800";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ease-out ${
        visible && !exiting
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgClass}`}>
        {icon}
        <span className={`text-sm font-medium ${textClass}`}>{message}</span>
        <button
          onClick={handleClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Toast;
