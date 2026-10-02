using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Priority1.ToDo.Api.Models;
using Priority1.ToDo.Api.Models.Requests;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Api.Controllers;

[ApiController]
[Route("todos")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly ITodoListService _listService;

    public TodosController(ITodoService todoService, ITodoListService listService)
    {
        _todoService = todoService;
        _listService = listService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TodoItem>>> GetAll(
        [FromQuery, Range(1, int.MaxValue)] int? listId, CancellationToken ct)
    {
        if (listId.HasValue && await _listService.GetByIdAsync(listId.Value, ct) is null)
        {
            return NotFound();
        }

        var todos = await _todoService.GetAllAsync(listId, ct);
        return Ok(todos.Select(TodoItem.From));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoItem>> GetById(int id, CancellationToken ct)
    {
        var todo = await _todoService.GetByIdAsync(id, ct);
        return todo is null ? NotFound() : Ok(TodoItem.From(todo));
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> Create([FromBody] CreateTodoRequest request, CancellationToken ct)
    {
        var created = await _todoService.CreateAsync(request.ToModel(), ct);
        if (created is null)
        {
            ModelState.AddModelError(nameof(request.TodoListId), "The selected list does not exist.");
            return ValidationProblem(ModelState);
        }
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, TodoItem.From(created));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TodoItem>> Update(int id, [FromBody] UpdateTodoRequest request, CancellationToken ct)
    {
        var updated = await _todoService.UpdateAsync(request.ToModel(id), ct);
        return updated is null ? NotFound() : Ok(TodoItem.From(updated));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await _todoService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
