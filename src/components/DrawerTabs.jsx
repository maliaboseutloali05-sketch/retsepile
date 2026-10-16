import { STATUSES } from '../utils/students.js';

/**
 * DrawerTabs - the folder-style tabs that filter the drawer by status.
 * `counts` is an object like { All: 8, Active: 5, ... } made by countByStatus().
 */
export default function DrawerTabs({ active, counts, onChange }) {
  const tabs = ['All', ...STATUSES];

  return (
    <nav className="tabs" aria-label="Filter by enrolment status">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`tabs__tab ${active === tab ? 'is-active' : ''}`}
          aria-pressed={active === tab}
          onClick={() => onChange(tab)}
        >
          {tab}
          <span className="tabs__count">{counts[tab]}</span>
        </button>
      ))}
    </nav>
  );
}
