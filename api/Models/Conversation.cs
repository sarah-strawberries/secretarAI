using System.Text.Json.Serialization;

namespace api.Models;

public class Conversation
{
    public int Id { get; set; }
    [JsonPropertyName("account_id")]
    public int AccountId { get; set; }
    public string? Title { get; set; }
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }
}
