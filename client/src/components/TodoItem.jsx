import { useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';

export default function TodoItem({ todo, disabled, onToggle, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  function cancelEdit() {
    setDraft(todo.title);
    setEditing(false);
  }

  async function saveEdit(e) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (trimmed === todo.title || await onRename(todo, trimmed)) setEditing(false);
  }

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.isComplete}
        disabled={disabled || editing}
        onChange={() => onToggle(todo)}
        aria-label={`Complete ${todo.title}`}
        title="Mark complete / incomplete"
      />

      {editing ? (
        <form className="item-edit-form" onSubmit={saveEdit}>
          <input className="edit-title" aria-label="Item title" value={draft} autoFocus
            maxLength={200} required disabled={disabled}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape' && !disabled) cancelEdit(); }} />
          <button className="icon-button primary" type="submit" disabled={disabled || !draft.trim()}
            title="Save item title" aria-label="Save item title"><Check size={18} /></button>
          <button className="icon-button" type="button" disabled={disabled} onClick={cancelEdit}
            title="Cancel item edit" aria-label="Cancel item edit"><X size={18} /></button>
        </form>
      ) : (
        <span
          className={`title ${todo.isComplete ? 'complete' : ''}`}
          onDoubleClick={() => { if (!disabled) { setDraft(todo.title); setEditing(true); } }}
        >
          {todo.title}
        </span>
      )}

      {!editing && (
        <button className="icon-button" disabled={disabled}
          onClick={() => { setDraft(todo.title); setEditing(true); }}
          title="Edit item" aria-label={`Edit ${todo.title}`}><Pencil size={18} /></button>
      )}
      {!editing && <button className="icon-button danger" disabled={disabled} onClick={() => onDelete(todo)}
        title="Delete item" aria-label={`Delete ${todo.title}`}><Trash2 size={18} /></button>}
    </li>
  );
}
