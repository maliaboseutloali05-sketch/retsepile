import Stamp from './Stamp.jsx';

/**
 * Ledger - the alternative "table" view of the same records.
 * The card view is for browsing; the ledger is for comparing many students
 * at once. Both receive exactly the same props, so switching view never
 * changes the data, only how it is drawn.
 */
export default function Ledger({ students, onEdit, onDelete }) {
  return (
    <div className="ledger-wrap">
      <table className="ledger">
        <caption className="sr-only">Student ledger</caption>
        <thead>
          <tr>
            <th scope="col">File no.</th>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">Email</th>
            <th scope="col">Course</th>
            <th scope="col">Mode</th>
            <th scope="col">Status</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="ledger__id">{student.id}</td>
              <th scope="row">{student.fullName}</th>
              <td>{student.age}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>{student.fullTime ? 'Full-time' : 'Part-time'}</td>
              <td>
                <Stamp key={student.status} status={student.status} small />
              </td>
              <td className="ledger__actions">
                <button type="button" className="link-btn" onClick={() => onEdit(student)} aria-label={`Amend ${student.fullName}`}>
                  Amend
                </button>
                <button
                  type="button"
                  className="link-btn link-btn--danger"
                  onClick={() => onDelete(student)}
                  aria-label={`Remove ${student.fullName}`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
