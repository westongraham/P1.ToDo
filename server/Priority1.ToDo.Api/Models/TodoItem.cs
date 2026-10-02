using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models;

public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int TodoListId { get; set; }
    public bool IsComplete { get; set; }
    public DateOnly? DueDate { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }

    public static TodoItem From(Todo todo)
    {
        return new TodoItem
        {
            Id = todo.Id,
            Title = todo.Title,
            TodoListId = todo.TodoListId,
            IsComplete = todo.IsComplete,
            DueDate = todo.DueDate,
            CreateDate = todo.CreateDate,
            UpdateDate = todo.UpdateDate
        };
    }

    public Todo ToModel()
    {
        return new Todo
        {
            Id = Id,
            Title = Title,
            TodoListId = TodoListId,
            IsComplete = IsComplete,
            DueDate = DueDate,
            CreateDate = CreateDate,
            UpdateDate = UpdateDate
        };
    }
}
