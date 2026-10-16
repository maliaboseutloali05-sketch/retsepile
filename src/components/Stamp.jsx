import { STATUS_META } from '../utils/students.js';

/**
 * Stamp - the inked enrolment status.
 * It is a tiny presentational component: props in, markup out, no state.
 * The `key` given by the parent changes when the status changes, which makes
 * React re-create the element so the "stamp down" animation plays again.
 */
export default function Stamp({ status, small = false, inline = false }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`stamp stamp--${meta.tone} ${small ? 'stamp--small' : ''} ${inline ? 'stamp--inline' : ''}`}
      aria-label={`Status: ${status}`}
    >
      {meta.stamp}
    </span>
  );
}
