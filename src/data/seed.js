/**
 * seed.js - the sample students shown when the app opens for the first time.
 *
 * HOW TO EDIT THIS FILE
 *  - Change any value, add a new { ... } block, or delete one. Save the file
 *    and the app picks up the new list automatically (the browser's saved copy
 *    is replaced whenever this file changes).
 *  - Every student needs these fields:
 *      id        string   exactly 9 digits, must be unique (keep it in quotes
 *                         so leading zeros are never lost)
 *      fullName  string   first name and surname
 *      age       number   16 to 70 (no quotes)
 *      email     string   must be unique
 *      course    string   should match one of the names in COURSES
 *                         (src/utils/students.js) so the Edit form can show it
 *      status    string   "Active" | "Deferred" | "Graduated" | "Withdrawn"
 *      fullTime  boolean  true = full-time, false = part-time (no quotes)
 *  - The list is an array of objects. The LAST item is treated as the
 *    most recently filed when sorting by "Newest filed".
 */
export const SEED_STUDENTS = [
  {
    id: '901021241',
    fullName: 'Maliabo Seutloali',
    age: 21,
    email: 'maliaboseutloali05@gmail.com',
    course: 'Diploma in Business Information Technology',
    status: 'Active',
    fullTime: true,
  },
  {
    id: '901024389',
    fullName: 'Limpho Nkhahle',
    age: 23,
    email: 'limphonkhahle07@gmail.com',
    course: 'Bachelor in Software Engineering with Multimedia',
    status: 'Active',
    fullTime: true,
  },
  {
    id: '901021809',
    fullName: 'Tieho Tolo',
    age: 20,
    email: 'tolotieho@gmail.com',
    course: 'Bachelor in Software Engineering',
    status: 'Active',
    fullTime: true,
  },
  {
    id: '901035167',
    fullName: 'Kamohelo Koali',
    age: 20,
    email: 'koalikamohelo96@gmail.com',
    course: 'Diploma in Information Technology',
    status: 'Deferred',
    fullTime: false,
  },
  {
    id: '901020408',
    fullName: 'Rethabile Ratalane',
    age: 30,
    email: 'rethabileratalane@gmail.com',
    course: 'Bachelor in Business Information Technology',
    status: 'Graduated',
    fullTime: true,
  },
  {
    id: '901021255',
    fullName: 'Karabo Mohapi',
    age: 21,
    email: 'karabomohapi@gmail.com',
    course: 'Diploma in Business Information Technology',
    status: 'Active',
    fullTime: false,
  },
  {
    id: '901031234',
    fullName: 'Reitumetse Lebona',
    age: 23,
    email: 'reitumetselebona@gmail.com',
    course: 'Software Engineering',
    status: 'Withdrawn',
    fullTime: true,
  },
  {
    id: '901051786',
    fullName: 'Limpho Nkhahle',
    age: 18,
    email: 'limphonkhahle@gmail.com',
    course: 'Diploma in Information Technology',
    status: 'Active',
    fullTime: true,
  },
];
