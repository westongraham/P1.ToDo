import { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import {
  getLists, createList, renameList, deleteList,
  getTodos, createTodo, updateTodo, deleteTodo,
} from './api';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import ListManager from './components/ListManager';
import DeleteListDialog from './components/DeleteListDialog';
import { localToday, sortTodos } from './dateUtils';

export default function App() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [listsLoading, setListsLoading] = useState(true);
  const [items, setItems] = useState({ listId: null, todos: [], loading: false, error: null });
  const [itemsVersion, setItemsVersion] = useState(0);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sortMode, setSortMode] = useState('createDate');
  const [today, setToday] = useState(localToday);
  const mutationPending = useRef(false);

  const selectedList = lists.find((list) => list.id === selectedListId);
  const itemsReady = !!selectedList && items.listId === selectedListId && !items.loading && !items.error;
  const controlsDisabled = pending || listsLoading || !!deleteTarget;
  const sortedTodos = sortTodos(items.todos, sortMode);

  useEffect(() => {
    const refreshToday = () => setToday(localToday());
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refreshToday();
    };
    const timer = window.setInterval(refreshToday, 60_000);
    window.addEventListener('focus', refreshToday);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshToday);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const loadLists = useCallback(async (signal) => {
    const loaded = await getLists({ signal });
    if (signal?.aborted) return;
    setLists(loaded);
    setSelectedListId((current) => (
      loaded.some((list) => list.id === current) ? current : loaded[0]?.id ?? null
    ));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadLists(controller.signal)
      .catch((e) => { if (!controller.signal.aborted) setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setListsLoading(false); });
    return () => controller.abort();
  }, [loadLists]);

  useEffect(() => {
    if (selectedListId === null) {
      setItems({ listId: null, todos: [], loading: false, error: null });
      return;
    }

    const controller = new AbortController();
    setItems({ listId: selectedListId, todos: [], loading: true, error: null });
    getTodos(selectedListId, { signal: controller.signal })
      .then((todos) => {
        if (!controller.signal.aborted) {
          setItems({ listId: selectedListId, todos, loading: false, error: null });
        }
      })
      .catch(async (e) => {
        if (controller.signal.aborted) return;
        setItems({ listId: selectedListId, todos: [], loading: false, error: e.message });
        if (e.status === 404) {
          try {
            await loadLists(controller.signal);
          } catch (refreshError) {
            if (!controller.signal.aborted) setError(refreshError.message);
          }
        }
      });
    return () => controller.abort();
  }, [selectedListId, itemsVersion, loadLists]);

  async function mutate(action) {
    // Block duplicate clicks even before React renders disabled controls.
    if (mutationPending.current) return false;
    mutationPending.current = true;
    setPending(true);
    setError(null);
    try {
      await action();
      return true;
    } catch (e) {
      setError(e.message);
      if (e.status === 404) {
        try {
          await loadLists();
          setItemsVersion((version) => version + 1);
        } catch (refreshError) {
          setError(refreshError.message);
        }
      }
      return false;
    } finally {
      mutationPending.current = false;
      setPending(false);
    }
  }

  function handleSelect(id) {
    if (mutationPending.current || deleteTarget) return;
    setError(null);
    setSelectedListId(id);
  }

  function handleCreateList(title) {
    return mutate(async () => {
      const created = await createList(title);
      setLists((current) => [...current, created].sort((a, b) => a.id - b.id));
      setSelectedListId(created.id);
    });
  }

  function handleRenameList(title) {
    return mutate(async () => {
      const updated = await renameList(selectedListId, title);
      setLists((current) => current.map((list) => list.id === updated.id ? updated : list));
    });
  }

  function removeList(list) {
    return mutate(async () => {
      await deleteList(list.id);
      const remaining = lists.filter((item) => item.id !== list.id);
      setLists(remaining);
      setSelectedListId(remaining[0]?.id ?? null);
      setDeleteTarget(null);
    });
  }

  function handleDeleteList() {
    if (!itemsReady || mutationPending.current) return;
    setError(null);
    if (items.todos.length > 0) {
      setDeleteTarget({ ...selectedList, count: items.todos.length });
    } else {
      return removeList(selectedList);
    }
  }

  function handleAdd(title, dueDate) {
    return mutate(async () => {
      const created = await createTodo({ title, dueDate, todoListId: selectedListId });
      setItems((current) => ({ ...current, todos: [...current.todos, created] }));
    });
  }

  function handleUpdate(todo, title, isComplete, dueDate = todo.dueDate ?? null) {
    return mutate(async () => {
      const updated = await updateTodo(todo.id, {
        title, isComplete, dueDate,
      });
      setItems((current) => ({
        ...current,
        todos: current.todos.map((item) => item.id === updated.id ? updated : item),
      }));
    });
  }

  function handleDelete(todo) {
    return mutate(async () => {
      await deleteTodo(todo.id);
      setItems((current) => ({
        ...current, todos: current.todos.filter((item) => item.id !== todo.id),
      }));
    });
  }

  async function handleRetry() {
    if (mutationPending.current) return;
    setError(null);
    setListsLoading(true);
    try {
      await loadLists();
      setItemsVersion((version) => version + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setListsLoading(false);
    }
  }

  const shownError = error || (items.listId === selectedListId ? items.error : null);

  return (
    <main className="app" aria-busy={pending || listsLoading}>
      <h1>Priority1 ToDo</h1>

      {shownError && !deleteTarget && (
        <div className="error-banner" role="alert">
          <span>{shownError}</span>
          <button className="icon-button" onClick={handleRetry} disabled={controlsDisabled}
            title="Retry loading lists and items" aria-label="Retry loading lists and items">
            <RotateCw size={18} />
          </button>
        </div>
      )}

      {listsLoading && <p className="muted" role="status">Loading lists...</p>}
      {!listsLoading && lists.length === 0 && !shownError && <h2>Create your first list</h2>}

      <ListManager lists={lists} selectedList={selectedList} disabled={controlsDisabled}
        actionsDisabled={controlsDisabled || !itemsReady}
        onSelect={handleSelect} onCreate={handleCreateList}
        onRename={handleRenameList} onDelete={handleDeleteList} />

      {selectedList && (
        <section key={selectedListId} className="items-section" aria-labelledby="selected-list-title">
          <h2 id="selected-list-title">{selectedList.title}</h2>
          <AddTodoForm onAdd={handleAdd} disabled={controlsDisabled || !itemsReady} />
          <label className="sort-control">
            <span>Sort by</span>
            <select value={sortMode} disabled={controlsDisabled || !itemsReady}
              onChange={(e) => setSortMode(e.target.value)}>
              <option value="createDate">Create Date</option>
              <option value="dueDate">Due Date</option>
            </select>
          </label>
          {!itemsReady && !items.error && <p className="muted" role="status">Loading items...</p>}
          {itemsReady && (
            <TodoList todos={sortedTodos} today={today} disabled={controlsDisabled}
              onToggle={(todo) => handleUpdate(todo, todo.title, !todo.isComplete)}
              onEdit={(todo, title, dueDate) => handleUpdate(todo, title, todo.isComplete, dueDate)}
              onDelete={handleDelete} />
          )}
        </section>
      )}

      {deleteTarget && (
        <DeleteListDialog list={deleteTarget} pending={pending} error={error}
          onCancel={() => { if (!mutationPending.current) { setDeleteTarget(null); setError(null); } }}
          onConfirm={() => removeList(deleteTarget)} />
      )}
    </main>
  );
}
