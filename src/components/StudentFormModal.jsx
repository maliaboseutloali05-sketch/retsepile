import { useState } from 'react';
import Modal from './Modal.jsx';
import {
  COURSES,
  STATUSES,
  emptyForm,
  studentToForm,
  validateStudent,
} from '../utils/students.js';

/**
 * StudentFormModal - ONE form used for both "add" and "edit".
 * If a `student` prop is supplied we are editing; otherwise we are adding.
 * Reusing the component avoids writing (and debugging) the same form twice.
 *
 * Props:
 *   student  - record to edit, or null/undefined to add
 *   students - all records (needed to detect duplicate emails)
 *   onSave   - called with the raw form values once they pass validation
 *   onClose  - closes the dialog without saving (Cancel / Esc / backdrop)
 */
export default function StudentFormModal({ student, students, onSave, onClose }) {
  const isEditing = Boolean(student);

  // Local state: the form belongs to this component, not to the whole app.
  const [values, setValues] = useState(() => (isEditing ? studentToForm(student) : emptyForm()));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // One handler for every field. `name` tells us which key to update.
  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    const next = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(next);
    // After the first failed submit, re-check live so messages clear as the user fixes them.
    if (submitted) setErrors(validateStudent(next, students, student?.id));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the browser reloading the page
    setSubmitted(true);
    const found = validateStudent(values, students, student?.id);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // invalid: do NOT submit
    onSave(values);
  };

  return (
    <Modal
      kicker={isEditing ? `AMENDMENT · FILE ${student.id}` : 'FORM SR-1 · NEW ADMISSION'}
      title={isEditing ? 'Amend student file' : 'File a new student'}
      onClose={onClose}
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field label="Student ID" name="studentId" error={errors.studentId}>
          <input
            id="studentId"
            name="studentId"
            type="text"
            inputMode="numeric"
            maxLength={9}
            autoComplete="off"
            placeholder="9 digits, e.g. 901021241"
            value={values.studentId}
            onChange={handleChange}
            readOnly={isEditing /* an ID identifies the file, so it is locked when amending */}
            data-autofocus={isEditing ? undefined : true}
            aria-invalid={Boolean(errors.studentId)}
            aria-describedby={errors.studentId ? 'studentId-error' : undefined}
          />
        </Field>

        <Field label="Full name" name="fullName" error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="off"
            placeholder="e.g. Palesa Mokoena"
            value={values.fullName}
            onChange={handleChange}
            data-autofocus={isEditing ? true : undefined}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
        </Field>

        <div className="form__row">
          <Field label="Age" name="age" error={errors.age}>
            <input
              id="age"
              name="age"
              type="number"
              inputMode="numeric"
              placeholder="e.g. 20"
              value={values.age}
              onChange={handleChange}
              aria-invalid={Boolean(errors.age)}
              aria-describedby={errors.age ? 'age-error' : undefined}
            />
          </Field>

          <Field label="Enrolment status" name="status" error={errors.status}>
            <select id="status" name="status" value={values.status} onChange={handleChange}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Email address" name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            placeholder="name@example.com"
            value={values.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </Field>

        <Field label="Course of study" name="course" error={errors.course}>
          <select
            id="course"
            name="course"
            value={values.course}
            onChange={handleChange}
            aria-invalid={Boolean(errors.course)}
            aria-describedby={errors.course ? 'course-error' : undefined}
          >
            <option value="">Select a course…</option>
            {COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </Field>

        <label className="check">
          <input type="checkbox" name="fullTime" checked={values.fullTime} onChange={handleChange} />
          <span>Full-time student</span>
        </label>

        <footer className="dialog__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {isEditing ? 'Save amendments' : 'File student'}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

/** Label + control + error message, so every field is laid out the same way. */
function Field({ label, name, error, children }) {
  return (
    <div className={`field ${error ? 'field--bad' : ''}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {error && (
        <p className="field__error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
