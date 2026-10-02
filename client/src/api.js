
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TODOS_URL = `${API_BASE_URL}/todos`;
const LISTS_URL = `${API_BASE_URL}/todo-lists`;

async function handle(res) {
  if (!res.ok) {
    const problem = await res.json().catch(() => null);
    const messages = problem?.errors ? Object.values(problem.errors).flat() : [];
    const error = new Error(
      messages.join(' ') || problem?.detail || problem?.title ||
      `Request failed: ${res.status} ${res.statusText}`,
    );
    error.status = res.status;
    throw error;
  }
  // 204 No Content (e.g. DELETE) has no body to parse.
  return res.status === 204 ? null : res.json();
}

export function getTodos(listId, { signal } = {}) {
  return fetch(`${TODOS_URL}?listId=${encodeURIComponent(listId)}`, { signal }).then(handle);
}

export function createTodo({ title, todoListId, isComplete = false }) {
  return fetch(TODOS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, todoListId, isComplete }),
  }).then(handle);
}

export function updateTodo(id, { title, isComplete }) {
  return fetch(`${TODOS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isComplete }),
  }).then(handle);
}

export function deleteTodo(id) {
  return fetch(`${TODOS_URL}/${id}`, { method: 'DELETE' }).then(handle);
}

export function getLists({ signal } = {}) {
  return fetch(LISTS_URL, { signal }).then(handle);
}

export function createList(title) {
  return fetch(LISTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  }).then(handle);
}

export function renameList(id, title) {
  return fetch(`${LISTS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  }).then(handle);
}

export function deleteList(id) {
  return fetch(`${LISTS_URL}/${id}`, { method: 'DELETE' }).then(handle);
}
