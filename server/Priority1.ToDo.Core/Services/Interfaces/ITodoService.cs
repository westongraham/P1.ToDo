using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services.Interfaces;

public interface ITodoService
{
    Task<List<Todo>> GetAllAsync(int? listId = null, CancellationToken ct = default);

    Task<Todo?> GetByIdAsync(int id, CancellationToken ct = default);

    Task<Todo?> CreateAsync(Todo itemToCreate, CancellationToken ct = default);

    Task<Todo?> UpdateAsync(Todo itemToUpdate, CancellationToken ct = default);

    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
