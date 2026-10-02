import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function AddTodoForm({ onAdd, disabled }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    if (await onAdd(trimmed, dueDate || null)) {
      setTitle('');
      setDueDate('');
    }
  }

  return (
    <form className="add-form add-todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        aria-label="New item title"
        placeholder="What needs doing?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        required
        disabled={disabled}
      />
      <label className="date-field">
        <span>Due date (optional)</span>
        <input type="date" value={dueDate} max="9999-12-31" disabled={disabled}
          onChange={(e) => setDueDate(e.target.value)} />
      </label>
      <button type="submit" className="primary" disabled={disabled || !title.trim()}>
        <Plus size={18} />Add
      </button>
    </form>
  );
}
