/**
 * students.js - the "logic layer" of the app.
 *
 * Everything in here is plain JavaScript (no React). Keeping the logic in
 * pure functions makes it easy to reason about, reuse and test:
 * the same input always gives the same output and nothing is mutated.
 */

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

// `const` because these bindings must never be reassigned.
// Arrays and objects declared with const can still be read freely;
// we simply never change them (we copy them instead - see CRUD below).
export const COURSES = [
  'Diploma in Information Technology',
  'Diploma in Business Information Technology',
  'Bachelor in Business Information Technology',
  'Bachelor in Software Engineering',
  'Bachelor in Software Engineering with Multimedia',
  'Software Engineering',
  'Networking & Cyber Security',
  'Multimedia & Web Design',
  'Business Analytics',
];

// Student IDs are exactly nine digits, e.g. 901021241.
// Kept as a STRING (not a number) so leading zeros are never lost.
const STUDENT_ID_PATTERN = /^\d{9}$/;

// Array of strings: the allowed enrolment statuses, in drawer-tab order.
export const STATUSES = ['Active', 'Deferred', 'Graduated', 'Withdrawn'];

// Object: extra display information for every status.
// The status stored on a student stays a plain, readable string ("Active");
// this lookup table decides how it is stamped on the card.
export const STATUS_META = {
  Active: { stamp: 'ENROLLED', tone: 'green' },
  Deferred: { stamp: 'ON HOLD', tone: 'amber' },
  Graduated: { stamp: 'GRADUATED', tone: 'blue' },
  Withdrawn: { stamp: 'WITHDRAWN', tone: 'red' },
};

// Object holding the sensible age range used by validation.
export const AGE_LIMITS = { min: 16, max: 70 };

// A regular expression (an object in JS) describing "something@something.tld".
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ------------------------------------------------------------------ */
/* Form helpers (strings in, typed values out)                         */
/* ------------------------------------------------------------------ */

/**
 * The blank form. Notice every value is a string except `fullTime`:
 * HTML inputs always hand us text, so `age` starts as '' and is only
 * converted to a number when the form is submitted (see `normaliseForm`).
 */
export const emptyForm = () => ({
  studentId: '',
  fullName: '',
  age: '',
  email: '',
  course: '',
  status: 'Active',
  fullTime: true, // boolean (checkbox)
});

/** Turn a stored student into form values (number -> string for the input). */
export const studentToForm = (student) => ({
  studentId: student.id,
  fullName: student.fullName,
  age: String(student.age),
  email: student.email,
  course: student.course,
  status: student.status,
  fullTime: student.fullTime,
});

/**
 * Convert raw form values into the correct JavaScript types.
 *  - strings are trimmed (and double spaces collapsed)
 *  - age becomes a real number
 *  - email is lower-cased so "A@B.com" and "a@b.com" are treated as one address
 *  - fullTime is forced to a boolean
 */
export const normaliseForm = (values) => ({
  fullName: values.fullName.trim().replace(/\s+/g, ' '),
  age: Number(values.age),
  email: values.email.trim().toLowerCase(),
  course: values.course,
  status: values.status,
  fullTime: Boolean(values.fullTime),
});

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

/**
 * Validate the form.
 *
 * @param {object} values     raw form values
 * @param {Array}  students   current records (to detect duplicate e-mails)
 * @param {string} [editingId] id of the record being edited, so it does not
 *                             clash with itself
 * @returns {object} map of fieldName -> message. Empty object = valid.
 */
export function validateStudent(values, students, editingId = null) {
  const errors = {};
  const clean = normaliseForm(values);

  // Student ID: required, exactly nine digits, and unique across the drawer.
  const id = String(values.studentId ?? '').trim();
  if (id === '') {
    errors.studentId = 'A student ID is required.';
  } else if (!STUDENT_ID_PATTERN.test(id)) {
    errors.studentId = 'Student ID must be exactly 9 digits (e.g. 901021241).';
  } else if (students.some((s) => s.id === id && s.id !== editingId)) {
    errors.studentId = 'Another student file already uses this ID.';
  }

  // Full name: required, at least two words, letters/spaces/'/- only.
  if (clean.fullName === '') {
    errors.fullName = 'A full name is required.';
  } else if (clean.fullName.split(' ').length < 2) {
    errors.fullName = 'Please enter first name and surname.';
  } else if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(clean.fullName)) {
    errors.fullName = 'Names may only contain letters, spaces, . - and apostrophes.';
  }

  // Age: required, whole number, inside the allowed range.
  if (values.age.toString().trim() === '') {
    errors.age = 'Age is required.';
  } else if (!Number.isInteger(clean.age)) {
    errors.age = 'Age must be a whole number.';
  } else if (clean.age < AGE_LIMITS.min || clean.age > AGE_LIMITS.max) {
    errors.age = `Age must be between ${AGE_LIMITS.min} and ${AGE_LIMITS.max}.`;
  }

  // Email: required, correct shape, and unique across the drawer.
  if (clean.email === '') {
    errors.email = 'An email address is required.';
  } else if (!EMAIL_PATTERN.test(clean.email)) {
    errors.email = 'That does not look like a valid email (name@example.com).';
  } else {
    const taken = students.some(
      (s) => s.email === clean.email && s.id !== editingId
    );
    if (taken) errors.email = 'Another student file already uses this email.';
  }

  // Course + status must be one of the listed options.
  if (!COURSES.includes(clean.course)) {
    errors.course = 'Please choose a course of study.';
  }
  if (!STATUSES.includes(clean.status)) {
    errors.status = 'Please choose an enrolment status.';
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/* CRUD - every function returns a NEW array (immutability)            */
/* ------------------------------------------------------------------ */
/* React only re-renders when it sees a new array/object, so we never  */
/* push() or splice() the existing one.                                */

/** Build a complete student record from form values (the ID is typed in the form). */
export function createStudent(values) {
  return { id: values.studentId.trim(), ...normaliseForm(values) };
}

/** Create: add a record at the end. */
export const addStudent = (students, student) => [...students, student];

/** Update: replace the matching record, keep everything else. */
export const updateStudent = (students, id, values) =>
  students.map((s) => (s.id === id ? { ...s, ...normaliseForm(values) } : s));

/** Delete: keep every record except the one with this id. */
export const removeStudent = (students, id) => students.filter((s) => s.id !== id);

/** Undo helper: put a deleted record back at its old position. */
export const restoreStudent = (students, student, index) => {
  const at = Math.min(Math.max(index, 0), students.length);
  return [...students.slice(0, at), student, ...students.slice(at)];
};

/* ------------------------------------------------------------------ */
/* Display helpers                                                     */
/* ------------------------------------------------------------------ */

/** { All: 8, Active: 4, Deferred: 1, ... } - used for the drawer tabs. */
export function countByStatus(students) {
  const counts = { All: students.length };
  STATUSES.forEach((status) => {
    counts[status] = students.filter((s) => s.status === status).length;
  });
  return counts;
}

/** Summary numbers shown above the drawer. */
export function summarise(students) {
  if (students.length === 0) {
    return { total: 0, averageAge: null, fullTimePercent: null, courses: 0 };
  }
  // `var` is used here ON PURPOSE to demonstrate function scope: a var belongs
  // to the whole function, not just the block it is written in, whereas
  // let/const stop at the nearest curly braces. It is safe here because
  // totalAge is only used inside this function; elsewhere we prefer const.
  var totalAge = students.reduce((sum, s) => sum + s.age, 0);
  const fullTimeCount = students.filter((s) => s.fullTime).length;
  return {
    total: students.length,
    averageAge: Math.round((totalAge / students.length) * 10) / 10,
    fullTimePercent: Math.round((fullTimeCount / students.length) * 100),
    courses: new Set(students.map((s) => s.course)).size,
  };
}

/**
 * Sort options shown in the toolbar: value -> label + comparator.
 * Each comparator gets a third argument `pos`: a Map of id -> position in the
 * stored array. "Filed" order is simply that position (last item = newest),
 * because student IDs are not sequential.
 */
export const SORTERS = {
  newest: { label: 'Newest filed', compare: (a, b, pos) => pos.get(b.id) - pos.get(a.id) },
  oldest: { label: 'Oldest filed', compare: (a, b, pos) => pos.get(a.id) - pos.get(b.id) },
  name: { label: 'Name A-Z', compare: (a, b) => a.fullName.localeCompare(b.fullName) },
  age: { label: 'Age, youngest first', compare: (a, b) => a.age - b.age },
};

/** Apply the status tab, the search text and the chosen sort order. */
export function filterAndSort(students, { status, query, sortBy }) {
  const needle = query.trim().toLowerCase();
  const pos = new Map(students.map((s, index) => [s.id, index]));

  return students
    .filter((s) => status === 'All' || s.status === status)
    .filter(
      (s) =>
        needle === '' ||
        [s.fullName, s.email, s.id, s.course].some((field) =>
          field.toLowerCase().includes(needle)
        )
    )
    .slice() // copy first: sort() mutates, and we must not touch the original
    .sort((a, b) => SORTERS[sortBy].compare(a, b, pos));
}

/**
 * Give each card a small, stable tilt (-1.2deg ... +1.2deg) based on its id,
 * so the drawer looks hand-filed but cards never wobble between renders.
 */
export function tiltFor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 997;
  }
  return ((hash % 25) - 12) / 10;
}
