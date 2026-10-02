using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Services.Interfaces;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services;

public class TodoService : ITodoService
{
    private readonly AppDbContext _context;

    public TodoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Todo>> GetAllAsync(int? listId = null, CancellationToken ct = default)
    {
        var query = _context.Todos.AsNoTracking();
        if (listId.HasValue)
        {
            query = query.Where(todo => todo.TodoListId == listId.Value);
        }
        return await query.OrderBy(todo => todo.Id).ToListAsync(ct);
    }

    public async Task<Todo?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.Todos.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    public async Task<Todo?> CreateAsync(Todo itemToCreate, CancellationToken ct = default)
    {
        if (!await _context.TodoLists.AnyAsync(list => list.Id == itemToCreate.TodoListId, ct))
        {
            return null;
        }

        _context.Todos.Add(itemToCreate);
        await _context.SaveChangesAsync(ct);
        return itemToCreate;
    }

    public async Task<Todo?> UpdateAsync(Todo itemToUpdate, CancellationToken ct = default)
    {
        var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == itemToUpdate.Id, ct);
        if (todo is null)
        {
            return null;
        }

        todo.Title = itemToUpdate.Title;
        todo.IsComplete = itemToUpdate.IsComplete;

        await _context.SaveChangesAsync(ct);
        return todo;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id, ct);
        if (todo is null)
        {
            return false;
        }

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
