/**
 * EmptyState - what the user sees when there is nothing to list.
 * Two different situations, two different messages:
 *   1. the drawer really is empty (no records at all)
 *   2. records exist but the current search / tab hides them all
 */
export default function EmptyState({ drawerIsEmpty, onAdd, onLoadSamples, onClearFilters }) {
  if (drawerIsEmpty) {
    return (
      <div className="empty">
        <div className="empty__drawer" aria-hidden="true" />
        <h2>The drawer is empty</h2>
        <p>No student files have been filed yet.</p>
        <div className="empty__actions">
          <button type="button" className="btn btn--primary" onClick={onAdd}>
            + File the first student
          </button>
          <button type="button" className="btn btn--ghost" onClick={onLoadSamples}>
            Load sample files
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="empty">
      <h2>No files match</h2>
      <p>Nothing in the drawer fits your search or tab.</p>
      <button type="button" className="btn btn--ghost" onClick={onClearFilters}>
        Clear search and filters
      </button>
    </div>
  );
}
