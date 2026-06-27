/**
 * useToast Hook
 *
 * Manages toast notification state. Provides a `showToast` function
 * to trigger notifications and `toast` state for rendering.
 *
 * Usage:
 *   const { toast, showToast, hideToast } = useToast();
 *   showToast("Copied!", "success");
 */

import { useState, useCallback } from "react";

/**
 * @returns {{
 *   toast: { message: string, type: "success"|"error" } | null,
 *   showToast: (message: string, type?: "success"|"error") => void,
 *   hideToast: () => void
 * }}
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}
