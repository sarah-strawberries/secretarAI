namespace api.Models;

public class Note
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? NoteContent { get; set; }
    public int? ReminderId { get; set; }
}
