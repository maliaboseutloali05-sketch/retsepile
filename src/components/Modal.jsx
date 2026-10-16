import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal - the reusable shell for every dialog (add, edit, delete).
 *
 * It handles the behaviour all modals share, so the three dialogs
 * don't repeat it:
 *   - closes on Escape or when the dark backdrop is clicked
 *   - keeps keyboard focus inside the dialog (Tab / Shift+Tab loop)
 *   - locks page scrolling while open
 *   - returns focus to the button that opened it when it closes
 *
 * Props:
 *   title    - heading text (also announced by screen readers)
 *   kicker   - small form-number line above the title
 *   onClose  - function called when the user dismisses the dialog
 *   children - the dialog body (form fields, buttons ...)
 */
export default function Modal({ title, kicker, onClose, children }) {
  const dialogRef = useRef(null);

  // Keep the latest onClose in a ref so the effect below can run only once
  // (on open/close) and not every time the parent re-renders.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement; // remember who opened us
    const dialog = dialogRef.current;
    document.body.style.overflow = 'hidden';

    // Focus the first form control (or the dialog itself as a fallback).
    const first = dialog.querySelector('[data-autofocus]') || dialog.querySelector(FOCUSABLE);
    (first || dialog).focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      // Simple focus trap: wrap around at the first/last control.
      const items = Array.from(dialog.querySelectorAll(FOCUSABLE));
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup runs when the modal unmounts (closes).
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, []);

  return (
    <div
      className="backdrop"
      onMouseDown={(event) => {
        // Only close when the click lands on the backdrop itself,
        // not when it bubbles up from inside the dialog.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="dialog__head">
          {kicker && <p className="dialog__kicker">{kicker}</p>}
          <h2 id="dialog-title">{title}</h2>
          <button type="button" className="dialog__x" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
