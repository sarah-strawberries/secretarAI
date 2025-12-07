using api.Models;
using api.Services;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly DatabaseService _db;
    private readonly HttpClient _httpClient;
    private const string AiUrl = "http://ai-snow.reindeer-pinecone.ts.net:9292/v1/chat/completions";
    private const string AiModel = "gpt-oss-120b";

    public ChatController(DatabaseService db, IHttpClientFactory httpClientFactory)
    {
        _db = db;
        _httpClient = httpClientFactory.CreateClient();
    }

    private async Task<int> GetCurrentAccountIdAsync()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value ?? User.FindFirst("email")?.Value;
        if (string.IsNullOrEmpty(email))
        {
            throw new UnauthorizedAccessException("Email claim not found");
        }

        var account = await _db.GetAccountByEmailAsync(email);
        if (account == null)
        {
            throw new UnauthorizedAccessException("Account not found");
        }
        return account.Id;
    }

    [HttpPost("conversations")]
    public async Task<ActionResult<CreateConversationResponse>> CreateConversation([FromBody] CreateConversationRequest request)
    {
        try
        {
            var accountId = await GetCurrentAccountIdAsync();
            using var conn = _db.CreateConnection();
            
            var sql = @"
                INSERT INTO secreterai.conversation(account_id, title) 
                VALUES(@AccountId, @Title)
                RETURNING id, account_id, title, created_at";
            
            var conversation = await conn.QuerySingleAsync<Conversation>(sql, new { AccountId = accountId, Title = request.Title });
            
            return Ok(new CreateConversationResponse(conversation));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to create conversation", details = ex.Message });
        }
    }

    [HttpGet("conversations")]
    public async Task<ActionResult<ListConversationsResponse>> ListConversations()
    {
        try
        {
            var accountId = await GetCurrentAccountIdAsync();
            using var conn = _db.CreateConnection();

            var sql = @"
                SELECT id, account_id, title, created_at
                FROM secreterai.conversation
                WHERE account_id = @AccountId 
                  AND title IS NOT NULL 
                  AND trim(title) <> ''
                ORDER BY created_at DESC, id DESC";

            var conversations = await conn.QueryAsync<Conversation>(sql, new { AccountId = accountId });
            
            return Ok(new ListConversationsResponse(conversations));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to list conversations", details = ex.Message });
        }
    }

    [HttpGet("conversations/{id}/messages")]
    public async Task<ActionResult<ListMessagesResponse>> ListMessages(int id)
    {
        try
        {
            var accountId = await GetCurrentAccountIdAsync();
            using var conn = _db.CreateConnection();

            // Verify conversation ownership
            var convSql = "SELECT count(1) FROM secreterai.conversation WHERE id = @Id AND account_id = @AccountId";
            var exists = await conn.ExecuteScalarAsync<int>(convSql, new { Id = id, AccountId = accountId });
            
            if (exists == 0)
            {
                return NotFound(new { error = "Conversation not found or access denied" });
            }

            var sql = @"
                SELECT id, conversation_id, role, content, created_at
                FROM secreterai.message 
                WHERE conversation_id = @ConversationId
                ORDER BY created_at ASC, id ASC";

            var messages = await conn.QueryAsync<Message>(sql, new { ConversationId = id });
            
            return Ok(new ListMessagesResponse(messages));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to list messages", details = ex.Message });
        }
    }

    [HttpPost("messages/send")]
    public async Task<ActionResult<SendMessageResponse>> SendMessage([FromBody] SendMessageRequest request)
    {
        try
        {
            var accountId = await GetCurrentAccountIdAsync();
            using var conn = _db.CreateConnection();

            // Verify conversation ownership
            var convSql = "SELECT count(1) FROM secreterai.conversation WHERE id = @Id AND account_id = @AccountId";
            var exists = await conn.ExecuteScalarAsync<int>(convSql, new { Id = request.ConversationId, AccountId = accountId });
            
            if (exists == 0)
            {
                return NotFound(new { error = "Conversation not found or access denied" });
            }

            // Fetch prior messages
            var priorSql = @"
                SELECT role, content 
                FROM secreterai.message 
                WHERE conversation_id = @ConversationId AND role IN ('user','assistant') 
                ORDER BY created_at ASC, id ASC";
            
            var priorMessages = (await conn.QueryAsync<AiMessage>(priorSql, new { ConversationId = request.ConversationId })).ToList();

            // Insert user message
            var insertUserSql = @"
                INSERT INTO secreterai.message(conversation_id, role, content) 
                VALUES(@ConversationId, 'user', @Content)
                RETURNING id, conversation_id, role, content, created_at";
            
            var userMessage = await conn.QuerySingleAsync<Message>(insertUserSql, new { ConversationId = request.ConversationId, Content = request.Content });

            // Auto-title if first message
            if (!priorMessages.Any())
            {
                _ = Task.Run(async () => 
                {
                    try 
                    {
                        var titlePromptMessages = new List<AiMessage>
                        {
                            new AiMessage("system", "You create very short (max 5 words) neutral, descriptive titles for a chat based ONLY on the user's first message. Output ONLY the title text without quotes."),
                            new AiMessage("user", request.Content)
                        };

                        var titleReq = new AiChatCompletionRequest(AiModel, titlePromptMessages);
                        var titleRes = await _httpClient.PostAsJsonAsync(AiUrl, titleReq);
                        
                        if (titleRes.IsSuccessStatusCode)
                        {
                            var titleJson = await titleRes.Content.ReadFromJsonAsync<AiChatCompletionResponse>();
                            var rawTitle = titleJson?.Choices?.FirstOrDefault()?.Message?.Content ?? "";
                            var cleaned = rawTitle.Replace("\n", " ").Trim();
                            if (cleaned.Length > 60) cleaned = cleaned.Substring(0, 60);
                            
                            if (!string.IsNullOrWhiteSpace(cleaned))
                            {
                                using var updateConn = _db.CreateConnection();
                                await updateConn.ExecuteAsync("UPDATE secreterai.conversation SET title = @Title WHERE id = @Id", new { Title = cleaned, Id = request.ConversationId });
                            }
                        }
                    }
                    catch 
                    {
                        // Ignore title generation errors
                    }
                });
            }

            // Prepare AI request
            var messagesForAi = new List<AiMessage>(priorMessages)
            {
                new AiMessage("user", request.Content)
            };

            var aiReq = new AiChatCompletionRequest(AiModel, messagesForAi);
            var aiRes = await _httpClient.PostAsJsonAsync(AiUrl, aiReq);
            
            if (!aiRes.IsSuccessStatusCode)
            {
                return StatusCode((int)aiRes.StatusCode, new { error = "AI service failed" });
            }

            var aiJson = await aiRes.Content.ReadFromJsonAsync<AiChatCompletionResponse>();
            var assistantText = aiJson?.Choices?.FirstOrDefault()?.Message?.Content ?? "";

            if (string.IsNullOrEmpty(assistantText))
            {
                return StatusCode(502, new { error = "AI response missing content" });
            }

            // Insert assistant message
            var insertAiSql = @"
                INSERT INTO secreterai.message(conversation_id, role, content) 
                VALUES(@ConversationId, 'assistant', @Content)
                RETURNING id, conversation_id, role, content, created_at";
            
            var assistantMessage = await conn.QuerySingleAsync<Message>(insertAiSql, new { ConversationId = request.ConversationId, Content = assistantText });

            return Ok(new SendMessageResponse(request.ConversationId, userMessage, assistantMessage, assistantText));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to send message", details = ex.Message });
        }
    }
}
