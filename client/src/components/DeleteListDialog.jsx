import { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteListDialog({ list, pending, error, onCancel, onConfirm }) {
  const dialog = useRef(null);

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);

  return (
    <dialog ref={dialog} className="delete-dialog" aria-labelledby="delete-list-title"
      aria-describedby="delete-list-description"
      onCancel={(e) => { e.preventDefault(); if (!pending) onCancel(); }}>
      <h2 id="delete-list-title">Delete &quot;{list.title}&quot;?</h2>
      <p id="delete-list-description">
        This list and all its items ({list.count}) will be permanently deleted.
      </p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="dialog-actions">
        <button onClick={onCancel} disabled={pending} autoFocus>Cancel</button>
        <button className="danger-primary" onClick={onConfirm} disabled={pending}>
          <Trash2 size={18} />{pending ? 'Deleting...' : 'Delete list'}
        </button>
      </div>
    </dialog>
  );
}
