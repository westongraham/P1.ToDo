using System.ComponentModel.DataAnnotations;

namespace Priority1.ToDo.Core.Domain;

public class TodoList : EntityBase
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public ICollection<Todo> Todos { get; set; } = new List<Todo>();
}
