/**
 * CopyButton Component
 *
 * Copies the full formatted summary to the clipboard using the
 * Clipboard API. Falls back to execCommand for older browsers.
 * Triggers a toast notification on success or failure via callback.
 */

import { useState } from "react";

/**
 * @param {Object} props
 * @param {string} props.text - The text content to copy
 * @param {Function} props.onCopy - Callback: (success: boolean) => void
 */
function CopyButton({ text, onCopy }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    let success = false;

    try {
      // Primary: Clipboard API (requires HTTPS or localhost)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        success = true;
      } else {
        // Fallback: execCommand for non-secure contexts or older browsers
        success = fallbackCopy(text);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      // Attempt fallback if Clipboard API throws
      success = fallbackCopy(text);
    }

    // Update visual state
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }

    // Notify parent for toast
    onCopy?.(success);
  }

  return (
    <button
      onClick={handleCopy}
      className="btn-secondary flex items-center gap-2 text-sm"
      title="Copy full summary to clipboard"
      aria-label="Copy summary"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

/**
 * Fallback clipboard copy using a temporary textarea element.
 * Works in older browsers and non-HTTPS contexts.
 *
 * @param {string} text - Text to copy
 * @returns {boolean} Whether the copy succeeded
 */
function fallbackCopy(text) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Prevent scrolling to bottom
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const result = document.execCommand("copy");
    document.body.removeChild(textarea);

    return result;
  } catch {
    return false;
  }
}

export default CopyButton;
