using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class CreateTodoRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int TodoListId { get; set; }

    public bool IsComplete { get; set; }

    public Todo ToModel()
    {
        return new Todo
        {
            Title = Title.Trim(),
            TodoListId = TodoListId,
            IsComplete = IsComplete
        };
    }
}
