import TodoItem from './TodoItem';

export default function TodoList({ todos, today, disabled, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) {
    return <p className="muted">No items in this list.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          today={today}
          disabled={disabled}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
