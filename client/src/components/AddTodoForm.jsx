import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function AddTodoForm({ onAdd, disabled }) {
  const [title, setTitle] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    if (await onAdd(trimmed)) setTitle('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
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
      <button type="submit" className="primary" disabled={disabled || !title.trim()}>
        <Plus size={18} />Add
      </button>
    </form>
  );
}
