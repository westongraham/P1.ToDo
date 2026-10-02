using Microsoft.AspNetCore.Mvc;
using Priority1.ToDo.Api.Models;
using Priority1.ToDo.Api.Models.Requests;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Api.Controllers;

[ApiController]
[Route("todo-lists")]
public class TodoListsController : ControllerBase
{
    private readonly ITodoListService _listService;

    public TodoListsController(ITodoListService listService)
    {
        _listService = listService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TodoListItem>>> GetAll(CancellationToken ct)
    {
        var lists = await _listService.GetAllAsync(ct);
        return Ok(lists.Select(TodoListItem.From));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoListItem>> GetById(int id, CancellationToken ct)
    {
        var list = await _listService.GetByIdAsync(id, ct);
        return list is null ? NotFound() : Ok(TodoListItem.From(list));
    }

    [HttpPost]
    public async Task<ActionResult<TodoListItem>> Create([FromBody] SaveTodoListRequest request, CancellationToken ct)
    {
        var list = await _listService.CreateAsync(request.ToModel(), ct);
        return CreatedAtAction(nameof(GetById), new { id = list.Id }, TodoListItem.From(list));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TodoListItem>> Update(int id, [FromBody] SaveTodoListRequest request, CancellationToken ct)
    {
        var list = await _listService.UpdateAsync(request.ToModel(id), ct);
        return list is null ? NotFound() : Ok(TodoListItem.From(list));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await _listService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
