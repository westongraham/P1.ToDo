import { useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { isOverdue } from '../dateUtils';

export default function TodoItem({ todo, today, disabled, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [dueDateDraft, setDueDateDraft] = useState(todo.dueDate ?? '');
  const overdue = isOverdue(todo, today);

  function startEdit() {
    if (disabled) return;
    setDraft(todo.title);
    setDueDateDraft(todo.dueDate ?? '');
    setEditing(true);
  }

  function cancelEdit() {
    setDraft(todo.title);
    setDueDateDraft(todo.dueDate ?? '');
    setEditing(false);
  }

  async function saveEdit(e) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    const dueDate = dueDateDraft || null;
    const unchanged = trimmed === todo.title && dueDate === (todo.dueDate ?? null);
    if (unchanged || await onEdit(todo, trimmed, dueDate)) setEditing(false);
  }

  return (
    <li className={`todo-item${overdue ? ' overdue' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isComplete}
        disabled={disabled || editing}
        onChange={() => onToggle(todo)}
        aria-label={`${todo.isComplete ? 'Reopen' : 'Complete'} ${todo.title}`}
        title="Mark complete / incomplete"
      />

      {editing ? (
        <form className="item-edit-form" onSubmit={saveEdit}
          onKeyDown={(e) => { if (e.key === 'Escape' && !disabled) cancelEdit(); }}>
          <div className="item-edit-heading">
            <input className="edit-title" aria-label="Item title" value={draft} autoFocus
              maxLength={200} required disabled={disabled}
              onChange={(e) => setDraft(e.target.value)} />
            {overdue && <span className="overdue-badge">Overdue</span>}
          </div>
          <label className="date-field">
            <span>Due date (optional)</span>
            <input type="date" value={dueDateDraft} max="9999-12-31" disabled={disabled}
              onChange={(e) => setDueDateDraft(e.target.value)} />
          </label>
          <button type="button" disabled={disabled || !dueDateDraft}
            onClick={() => setDueDateDraft('')}>Clear date</button>
          <div className="item-edit-actions">
            <button className="icon-button primary" type="submit" disabled={disabled || !draft.trim()}
              title="Save item" aria-label="Save item"><Check size={18} /></button>
            <button className="icon-button" type="button" disabled={disabled} onClick={cancelEdit}
              title="Cancel item edit" aria-label="Cancel item edit"><X size={18} /></button>
          </div>
        </form>
      ) : (
        <div className="item-details">
          <span className={`title ${todo.isComplete ? 'complete' : ''}`}
            onDoubleClick={startEdit}>{todo.title}</span>
          <span className="due-date muted">
            {todo.dueDate ? <>Due: <time dateTime={todo.dueDate}>{todo.dueDate}</time></> : 'No due date'}
            {overdue && <span className="overdue-badge">Overdue</span>}
          </span>
        </div>
      )}

      {!editing && (
        <button className="icon-button" disabled={disabled}
          onClick={startEdit}
          title="Edit item" aria-label={`Edit ${todo.title}`}><Pencil size={18} /></button>
      )}
      {!editing && <button className="icon-button danger" disabled={disabled} onClick={() => onDelete(todo)}
        title="Delete item" aria-label={`Delete ${todo.title}`}><Trash2 size={18} /></button>}
    </li>
  );
}
