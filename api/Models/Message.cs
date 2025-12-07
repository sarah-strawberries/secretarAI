using System.Text.Json.Serialization;

namespace api.Models;

public class Message
{
    public int Id { get; set; }
    [JsonPropertyName("conversation_id")]
    public int ConversationId { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }
}
