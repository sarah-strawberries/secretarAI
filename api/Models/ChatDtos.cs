using System.Text.Json.Serialization;

namespace api.Models;

public record CreateConversationRequest(string? Title);

public record CreateConversationResponse(Conversation Conversation);

public record ListConversationsResponse(IEnumerable<Conversation> Conversations);

public record ListMessagesResponse(IEnumerable<Message> Messages);

public record SendMessageRequest(int ConversationId, string Content);

public record SendMessageResponse(
    int ConversationId,
    Message User,
    Message Assistant,
    string AssistantText
);

public record AiChatCompletionResponse(
    List<AiChoice> Choices
);

public record AiChoice(
    AiMessage Message
);

public record AiMessage(
    string Role,
    string Content
);

public record AiChatCompletionRequest(
    string Model,
    List<AiMessage> Messages
);
