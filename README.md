# The Registrar's Drawer

An interactive **Student Management System** built with **React + JavaScript** (Vite).
Instead of a plain dashboard, the app is styled as a steel filing cabinet: every student is a paper **index card**, enrolment status is an **ink stamp**, and filters are **folder tabs**.

Course: DIWA2210 Web Application Development · Individual Assignment

- **GitHub repository:** _add your URL here_
- **Live application:** _add your Netlify / Vercel URL here_

## Features

- View students as **index cards** or in a **ledger** (table) – switch with one click
- **Add**, **edit** and **delete** students through working modal dialogs
- Delete asks for confirmation and offers a short **Undo**
- Every record holds: student ID, full name, age, email, course of study, enrolment status (plus a full-time/part-time flag)
- **Validation** with clear messages (required fields, unique 9-digit student ID, whole-number age between 16 and 70, email format, duplicate email)
- Folder tabs filter by status (with live counts), plus **search** and **sort**
- Summary strip: files in drawer, average age, full-time %, number of courses
- UI updates **immediately** after every operation – no page refresh
- Data is saved in **localStorage** so it survives a refresh
- Responsive layout (desktop and mobile), keyboard accessible modals (Esc closes, focus is trapped, focus returns to the opener)
- Proper **empty states**: empty drawer, and "no files match"

## Run it locally

```bash
npm install
npm run dev        # development server
npm run build      # production build into /dist
npm run preview    # preview the production build
```

Requires Node 18 or newer. `node_modules` is not committed; `npm install` recreates it from `package.json`.

## Changing the sample students

Open `src/data/seed.js`. Each student is one `{ ... }` block; edit the values, add blocks or delete them, then save. The comment at the top of that file lists every field and its allowed values. The app saves its own copy in the browser, but that copy is tied to the contents of `seed.js`, so whenever you edit the file the new list loads automatically. (Courses must also exist in `COURSES` in `src/utils/students.js` for the Edit form to show them.)

## Project structure

```
registrars-drawer/
├─ index.html
├─ package.json
├─ vite.config.js
├─ netlify.toml
└─ src/
   ├─ main.jsx                 entry point
   ├─ App.jsx                  container: owns state, handlers, layout
   ├─ styles.css
   ├─ data/seed.js             sample records
   ├─ hooks/useLocalStorage.js custom hook (state + persistence)
   ├─ utils/students.js        pure logic: validation, CRUD, filtering, sorting
   └─ components/
      ├─ Modal.jsx             reusable dialog shell (open/close, focus, Esc)
      ├─ StudentFormModal.jsx  one form used for BOTH add and edit
      ├─ ConfirmDeleteModal.jsx
      ├─ IndexCard.jsx · Ledger.jsx · Stamp.jsx
      ├─ DrawerTabs.jsx · Toolbar.jsx · Summary.jsx
      ├─ EmptyState.jsx · Toast.jsx
```

The logic (`utils/students.js`) is plain JavaScript with no React in it, so it is easy to read and reason about. Components only display data and report events.

## JavaScript data types and why they were chosen

A student record is an **object**; the drawer is an **array of objects**.

```js
{ id: '901021241', fullName: 'Maliabo Seutloali', age: 21,
  email: 'maliaboseutloali05@gmail.com',
  course: 'Diploma in Business Information Technology',
  status: 'Active', fullTime: true }
```

| Field | Type | Why |
|---|---|---|
| `id`, `fullName`, `email`, `course`, `status` | string | Text. The student ID (`901021241`) is a string, not a number, because it is an identifier we never do maths on and a string can never lose leading zeros |
| `age` | number | Needed for comparison (range check), sorting and averaging |
| `fullTime` | boolean | A true/false fact; drives the Full-time/Part-time label and the full-time % |
| the whole drawer | array | An ordered list we can `map`, `filter`, `reduce` and `sort` |
| a student, `STATUS_META`, `AGE_LIMITS` | object | Groups related named values together |

**Handling input values:** HTML inputs always return text, so the form keeps `age` as a string while typing. `normaliseForm()` converts it with `Number()`, trims names, lower-cases the email and forces `fullTime` to a real boolean before saving.

## Variable declarations and why

- **`const`** – used by default for anything that is never reassigned: `COURSES`, `STATUSES`, `STATUS_META`, `EMAIL_PATTERN`, component results, handler functions. Declaring an array/object with `const` stops the *variable* being reassigned; we also never mutate the contents (we copy with spread/`map`/`filter`), which is what React needs.
- **`let`** – used where a value genuinely changes: the running `hash` in `tiltFor()` (`let hash`, and the loop counter `let i`).
- **`var`** – used once, on purpose, in `summarise()` (`var totalAge`). It demonstrates **function scope**: a `var` belongs to the whole function, while `let`/`const` are limited to the nearest `{ }` block. It is harmless there because `totalAge` is only used inside that function, but modern code prefers `const`, so it is kept to this single, commented example.

## Functions and application logic

All reusable functions live in `src/utils/students.js` and use parameters and return values:

- `validateStudent(values, students, editingId)` → returns an object of error messages (empty = valid); uses conditionals and `Array.some`
- `createStudent`, `addStudent`, `updateStudent`, `removeStudent`, `restoreStudent` → CRUD helpers, each **returns a new array** using spread, `map`, `filter`, `slice`
- `filterAndSort`, `countByStatus`, `summarise` → use `filter`, `some`, `reduce`, `sort`, `Set`
- `summarise` → uses `reduce` to total the ages and calculate the average
- Many are **arrow functions** (`removeStudent`, `normaliseForm`, `studentToForm` ...); others are **declared functions** (`validateStudent`, `createStudent`, `summarise`)

## React concepts demonstrated

- **Functional components, JSX and props** – every file in `components/`
- **`useState`** – `App` holds students, filter, query, sort, view, modal and toast state; the form modal holds its own `values`, `errors`, `submitted`
- **`useEffect`** – saving to localStorage, key/Esc handling and focus management in `Modal`, auto-dismiss in `Toast`
- **`useMemo` / `useCallback`** – derived lists and stable callbacks
- **Custom hook** – `useLocalStorage`
- **Controlled inputs** – the search box and every form field are driven by state
- **Lifting state up** – child components never change data themselves; they call `onEdit`, `onDelete`, `onSave`, `onClose` supplied by `App`
- **Keys** – `key={student.id}` for lists; `key={status}` on `Stamp` so the stamp animation replays when the status changes

## Modal implementation

One state object in `App` controls all dialogs:

```js
const [modal, setModal] = useState({ type: null, student: null }); // 'add' | 'edit' | 'delete' | null
```

Because it is a single value, two modals can never be open at once. The modals are rendered only while open, so closing resets them completely. The shared `Modal` component closes on **Cancel, the × button, Esc or a backdrop click**, locks page scrolling, traps Tab focus, and returns focus to the button that opened it.

## Testing

Manual test checklist – tick each one after running the app yourself:

| # | Test | Expected result | Done |
|---|---|---|---|
| 1 | Open app first time | 8 sample cards, counts add up | ☐ |
| 2 | Add with empty form | Modal stays open, required-field messages appear | ☐ |
| 3 | Add with age 200 or email `bad` | Age-range and email-format messages | ☐ |
| 4 | Add using an existing email | "Another student file already uses this email" | ☐ |
| 4b | Add with an ID that is not 9 digits, or already used | Student ID error message | ☐ |
| 5 | Add valid student | Modal closes, new card appears immediately | ☐ |
| 6 | Add → Cancel / Esc / click backdrop | Modal closes, nothing added | ☐ |
| 7 | Edit a student | Form is pre-filled; saved changes show instantly on the card | ☐ |
| 8 | Change status in edit | Stamp changes and re-animates | ☐ |
| 9 | Delete → Keep file | Nothing removed | ☐ |
| 10 | Delete → Remove file | Card disappears immediately | ☐ |
| 11 | Press Undo in the toast | Card returns in its old position | ☐ |
| 12 | Tabs, search, sort | List updates and "Showing x of y" is correct | ☐ |
| 13 | Search for nonsense | "No files match" + Clear button works | ☐ |
| 14 | Delete every student | "The drawer is empty" state; "Load sample files" restores data | ☐ |
| 15 | Refresh the page | Data is still there (localStorage) | ☐ |
| 16 | Ledger view | Same records shown as a table; scrolls sideways on mobile | ☐ |
| 17 | Resize to phone width (~375px) | No sideways page scroll, controls stack | ☐ |

## Deployment

1. Push the project (without `node_modules`) to a GitHub repository.
2. **Vercel:** Import the repo → framework "Vite" is detected → Deploy.
   **Netlify:** Add new site → Import from Git → build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).
3. Open the public URL and re-test add / edit / delete after deploying.

## Credits

Fonts from Google Fonts: Fraunces, Special Elite, Courier Prime.
