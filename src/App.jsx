import { useCallback, useMemo, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage.js";
import { SEED_STUDENTS } from "./data/seed.js";
import {
  addStudent,
  countByStatus,
  createStudent,
  filterAndSort,
  removeStudent,
  restoreStudent,
  summarise,
  updateStudent,
} from "./utils/students.js";

import Summary from "./components/Summary.jsx";
import DrawerTabs from "./components/DrawerTabs.jsx";
import Toolbar from "./components/Toolbar.jsx";
import IndexCard from "./components/IndexCard.jsx";
import Ledger from "./components/Ledger.jsx";
import EmptyState from "./components/EmptyState.jsx";
import StudentFormModal from "./components/StudentFormModal.jsx";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal.jsx";
import Toast from "./components/Toast.jsx";

// The saved copy in the browser is stored under a key that includes a short
// fingerprint of seed.js. Edit seed.js and the fingerprint changes, so the app
// loads your new sample data instead of an old saved copy.
const seedFingerprint = JSON.stringify(SEED_STUDENTS)
  .split("")
  .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7)
  .toString(36);
const STORAGE_KEY = `registrars-drawer:students:${seedFingerprint}`;
const VIEW_KEY = "registrars-drawer:view";

/**
 * App - the "container" component. It owns the important state and passes
 * data DOWN to children as props and receives events UP through callbacks.
 *
 * State overview
 *   students  array of student objects (persisted in localStorage)
 *   view      'cards' | 'ledger'      (persisted)
 *   filter    which status tab is open
 *   query     search text
 *   sortBy    key of SORTERS
 *   modal     { type: 'add' | 'edit' | 'delete' | null, student }
 *             ONE object controls all three dialogs, so two can never be
 *             open at once.
 *   toast     the current confirmation message (or null)
 */
export default function App() {
  const [students, setStudents] = useLocalStorage(STORAGE_KEY, SEED_STUDENTS);
  const [view, setView] = useLocalStorage(VIEW_KEY, "cards");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [modal, setModal] = useState({ type: null, student: null });
  const [toast, setToast] = useState(null);

  /* ---------- derived data (calculated, never stored) ---------- */
  // useMemo re-runs only when its inputs change.
  const visible = useMemo(
    () => filterAndSort(students, { status: filter, query, sortBy }),
    [students, filter, query, sortBy],
  );
  const counts = useMemo(() => countByStatus(students), [students]);
  const stats = useMemo(() => summarise(students), [students]);

  /* ---------- modal controls ---------- */
  const openAdd = () => setModal({ type: "add", student: null });
  const openEdit = (student) => setModal({ type: "edit", student });
  const openDelete = (student) => setModal({ type: "delete", student });
  const closeModal = useCallback(
    () => setModal({ type: null, student: null }),
    [],
  );

  /* ---------- toast ---------- */
  const dismissToast = useCallback(() => setToast(null), []);
  const showToast = (message, action) =>
    setToast({
      id: Date.now(),
      message,
      actionLabel: action?.label,
      onAction: action?.run,
    });

  /* ---------- CRUD handlers ---------- */
  // Create + Update share one handler: the modal type tells us which.
  const handleSave = (values) => {
    if (modal.type === "add") {
      const created = createStudent(values);
      setStudents((current) => addStudent(current, created));
      showToast(`Filed ${created.fullName} as ${created.id}.`);
    } else {
      setStudents((current) =>
        updateStudent(current, modal.student.id, values),
      );
      showToast(`Amended the file for ${modal.student.fullName}.`);
    }
    closeModal();
  };

  const handleConfirmDelete = () => {
    const removed = modal.student;
    const position = students.findIndex((s) => s.id === removed.id);
    setStudents((current) => removeStudent(current, removed.id));
    closeModal();
    showToast(`Removed ${removed.fullName}.`, {
      label: "Undo",
      run: () =>
        setStudents((current) => restoreStudent(current, removed, position)),
    });
  };

  const clearFilters = () => {
    setFilter("All");
    setQuery("");
  };

  const loadSamples = () => setStudents(SEED_STUDENTS);

  const drawerIsEmpty = students.length === 0;

  return (
    <div className="cabinet">
      {/* ---------- Drawer face: the page header ---------- */}
      <header className="face">
        <div className="face__plate">
          <p className="face__eyebrow">RETSEPILE SECONDARY SCHOOL</p>
          <h1>Retsepile's Registry Center</h1>
        </div>
        <div className="face__handle" aria-hidden="true" />
      </header>

      <main className="drawer">
        <Summary stats={stats} />

        <DrawerTabs active={filter} counts={counts} onChange={setFilter} />

        <section className="tray" aria-label="Student files">
          <Toolbar
            query={query}
            onQuery={setQuery}
            sortBy={sortBy}
            onSort={setSortBy}
            view={view}
            onView={setView}
            onAdd={openAdd}
          />

          <p className="tray__count" aria-live="polite">
            Showing {visible.length} of {students.length}{" "}
            {students.length === 1 ? "file" : "files"}
          </p>

          {visible.length === 0 ? (
            <EmptyState
              drawerIsEmpty={drawerIsEmpty}
              onAdd={openAdd}
              onLoadSamples={loadSamples}
              onClearFilters={clearFilters}
            />
          ) : view === "cards" ? (
            <div className="cards">
              {visible.map((student, index) => (
                <IndexCard
                  key={student.id}
                  student={student}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  delay={Math.min(index, 8) * 45}
                />
              ))}
            </div>
          ) : (
            <Ledger
              students={visible}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          )}
        </section>
      </main>

      <footer className="foot">
        Retsepile secondary school .Student portal
      </footer>

      {/* ---------- Modals: rendered only while open ---------- */}
      {(modal.type === "add" || modal.type === "edit") && (
        <StudentFormModal
          key={modal.student ? modal.student.id : "new"}
          student={modal.student}
          students={students}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
      {modal.type === "delete" && (
        <ConfirmDeleteModal
          student={modal.student}
          onConfirm={handleConfirmDelete}
          onClose={closeModal}
        />
      )}

      {toast && <Toast toast={toast} onDismiss={dismissToast} />}
    </div>
  );
}
