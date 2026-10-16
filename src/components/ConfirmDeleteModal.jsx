import Modal from './Modal.jsx';

/**
 * ConfirmDeleteModal - asks "are you sure?" before a record is removed.
 * It does not delete anything itself: it just calls onConfirm / onClose
 * and lets the parent (App) decide what to do. This is called
 * "lifting state up".
 */
export default function ConfirmDeleteModal({ student, onConfirm, onClose }) {
  return (
    <Modal kicker={`REMOVAL NOTICE · FILE ${student.id}`} title="Remove this file?" onClose={onClose}>
      <div className="confirm">
        <p>
          You are about to remove <strong>{student.fullName}</strong> ({student.course}) from the
          drawer.
        </p>
        <p className="confirm__hint">You can undo this for a few seconds afterwards.</p>
        <footer className="dialog__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose} data-autofocus>
            Keep file
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            Remove file
          </button>
        </footer>
      </div>
    </Modal>
  );
}
