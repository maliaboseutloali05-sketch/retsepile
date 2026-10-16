import { SORTERS } from '../utils/students.js';

/**
 * Toolbar - search box, sort menu, view switch and the "add" button.
 * These are "controlled inputs": their value lives in App's state and every
 * keystroke calls a handler that updates it, so React is always the single
 * source of truth.
 */
export default function Toolbar({ query, onQuery, sortBy, onSort, view, onView, onAdd }) {
  return (
    <div className="toolbar">
      <div className="toolbar__search">
        <label htmlFor="search" className="sr-only">
          Search students
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search name, email, file no. or course…"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
        />
      </div>

      <div className="toolbar__group">
        <label htmlFor="sort" className="sr-only">
          Sort students
        </label>
        <select id="sort" value={sortBy} onChange={(event) => onSort(event.target.value)}>
          {Object.entries(SORTERS).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <div className="switch" role="group" aria-label="Choose layout">
          <button type="button" className={view === 'cards' ? 'is-on' : ''} aria-pressed={view === 'cards'} onClick={() => onView('cards')}>
            Cards
          </button>
          <button type="button" className={view === 'ledger' ? 'is-on' : ''} aria-pressed={view === 'ledger'} onClick={() => onView('ledger')}>
            Ledger
          </button>
        </div>

        <button type="button" className="btn btn--primary" onClick={onAdd}>
          + File new student
        </button>
      </div>
    </div>
  );
}
