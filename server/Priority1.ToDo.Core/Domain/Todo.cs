namespace Priority1.ToDo.Core.Domain;

using System.ComponentModel.DataAnnotations;

public class Todo : EntityBase
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public bool IsComplete { get; set; } = false;

    public int TodoListId { get; set; }
    public TodoList TodoList { get; set; } = null!;
}
