import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';

export default function ListManager({
  lists, selectedList, disabled, actionsDisabled, onSelect, onCreate, onRename, onDelete,
}) {
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const editing = selectedList && editingId === selectedList.id;

  async function create(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (title && await onCreate(title)) setNewTitle('');
  }

  async function rename(e) {
    e.preventDefault();
    const title = draft.trim();
    if (title && await onRename(title)) setEditingId(null);
  }

  return (
    <section className="list-management" aria-label="List management">
      {lists.length > 0 && (
        <div className="list-selector">
          <label htmlFor="selected-list">List</label>
          <select id="selected-list" value={selectedList?.id ?? ''} disabled={disabled}
            onChange={(e) => { setEditingId(null); onSelect(Number(e.target.value)); }}>
            {lists.map((list) => <option key={list.id} value={list.id}>{list.title}</option>)}
          </select>
          <button className="icon-button" disabled={actionsDisabled || editing}
            title="Rename list" aria-label="Rename list"
            onClick={() => { setDraft(selectedList.title); setEditingId(selectedList.id); }}>
            <Pencil size={18} />
          </button>
          <button className="icon-button danger" disabled={actionsDisabled || editing}
            title="Delete list" aria-label="Delete list" onClick={onDelete}>
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {editing && (
        <form className="add-form rename-list-form" onSubmit={rename}>
          <input aria-label="List name" value={draft} onChange={(e) => setDraft(e.target.value)}
            maxLength={200} required autoFocus disabled={disabled} />
          <button className="icon-button primary" type="submit" title="Save list name"
            aria-label="Save list name" disabled={disabled || !draft.trim()}><Check size={18} /></button>
          <button className="icon-button" type="button" title="Cancel list rename"
            aria-label="Cancel list rename" disabled={disabled} onClick={() => setEditingId(null)}>
            <X size={18} />
          </button>
        </form>
      )}

      <form className="add-form create-list-form" onSubmit={create}>
        <input aria-label="New list name" placeholder="New list name" value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)} maxLength={200} required disabled={disabled} />
        <button className="primary" type="submit" disabled={disabled || !newTitle.trim()}>
          <Plus size={18} />Create list
        </button>
      </form>
    </section>
  );
}
