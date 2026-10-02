export function localToday(now = new Date()) {
  const year = String(now.getFullYear()).padStart(4, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isOverdue(todo, today) {
  return !todo.isComplete && !!todo.dueDate && todo.dueDate < today;
}

function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function creationKey(timestamp) {
  // AppDbContext records UTC. SQL datetime2 responses omit the zone suffix.
  // Normalize fractional precision without Date parsing, which loses ticks.
  const [seconds, fraction = ''] = timestamp.replace(/Z$/, '').split('.');
  return `${seconds}.${fraction.padEnd(7, '0')}`;
}

export function sortTodos(todos, mode) {
  return [...todos].sort((a, b) => {
    if (mode === 'dueDate') {
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && !b.dueDate) return -1;
      const dueOrder = compare(a.dueDate ?? '', b.dueDate ?? '');
      if (dueOrder) return dueOrder;
    }

    return compare(creationKey(b.createDate), creationKey(a.createDate)) || a.id - b.id;
  });
}
