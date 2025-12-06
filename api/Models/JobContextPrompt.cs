namespace api.Models;

public class JobContextPrompt
{
    public int Id { get; set; }
    public int JobContextId { get; set; }
    public int? AccountId { get; set; }
    public string Prompt { get; set; } = string.Empty;
}
