using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class SaveTodoListRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public TodoList ToModel(int id = 0)
    {
        return new TodoList { Id = id, Title = Title.Trim() };
    }
}
