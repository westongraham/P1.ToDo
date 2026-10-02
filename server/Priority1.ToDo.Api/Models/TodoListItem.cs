using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models;

public class TodoListItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }

    public static TodoListItem From(TodoList list)
    {
        return new TodoListItem
        {
            Id = list.Id,
            Title = list.Title,
            CreateDate = list.CreateDate,
            UpdateDate = list.UpdateDate
        };
    }
}
