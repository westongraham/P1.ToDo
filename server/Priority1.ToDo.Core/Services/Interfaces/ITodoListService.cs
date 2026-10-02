using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services.Interfaces;

public interface ITodoListService
{
    Task<List<TodoList>> GetAllAsync(CancellationToken ct = default);
    Task<TodoList?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<TodoList> CreateAsync(TodoList list, CancellationToken ct = default);
    Task<TodoList?> UpdateAsync(TodoList list, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
