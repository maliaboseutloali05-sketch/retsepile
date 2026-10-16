import Stamp from './Stamp.jsx';
import { tiltFor } from '../utils/students.js';

/**
 * IndexCard - one student shown as a paper index card.
 *
 * Props:
 *   student  - the record to display (object)
 *   onEdit   - function(student) called by the Amend button
 *   onDelete - function(student) called by the Remove button
 *   delay    - animation delay in ms so cards "file in" one after another
 */
export default function IndexCard({ student, onEdit, onDelete, delay = 0 }) {
  const { id, fullName, age, email, course, status, fullTime } = student;

  return (
    <article
      className="card"
      style={{ '--tilt': `${tiltFor(id)}deg`, animationDelay: `${delay}ms` }}
    >
      <span className="card__tab">{id}</span>

      <div className="card__body">
        <h3 className="card__name">{fullName}</h3>

        <dl className="card__lines">
          <div>
            <dt>Age</dt>
            <dd>{age}</dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>{fullTime ? 'Full-time' : 'Part-time'}</dd>
          </div>
          <div className="card__wide">
            <dt>Course</dt>
            <dd>{course}</dd>
          </div>
          <div className="card__wide">
            <dt>Email</dt>
            <dd className="card__email">{email}</dd>
          </div>
        </dl>

      </div>

      <footer className="card__actions">
        <button type="button" className="link-btn" onClick={() => onEdit(student)} aria-label={`Amend ${fullName}`}>
          Amend
        </button>
        <button
          type="button"
          className="link-btn link-btn--danger"
          onClick={() => onDelete(student)}
          aria-label={`Remove ${fullName}`}
        >
          Remove
        </button>
        {/* key={status}: when status changes, the stamp is re-inked with animation */}
        <Stamp key={status} status={status} inline />
      </footer>
    </article>
  );
}
