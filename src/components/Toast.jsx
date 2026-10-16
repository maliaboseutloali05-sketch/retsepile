import { useEffect } from 'react';

/**
 * Toast - a short confirmation slip at the bottom of the screen.
 * It dismisses itself after 6 seconds. An optional action button
 * (used for "Undo" after a delete) runs a callback supplied by App.
 */
export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer); // cancel if a new toast replaces this one
  }, [toast.id, onDismiss]);

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{toast.message}</span>
      {toast.actionLabel && (
        <button
          type="button"
          className="toast__action"
          onClick={() => {
            toast.onAction();
            onDismiss();
          }}
        >
          {toast.actionLabel}
        </button>
      )}
      <button type="button" className="toast__close" onClick={onDismiss} aria-label="Dismiss message">
        ×
      </button>
    </div>
  );
}
