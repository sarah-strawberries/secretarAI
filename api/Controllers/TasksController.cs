using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http.Headers;
using api.Services;
using api.Models;
using api.Models.GoogleModels;

namespace api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly TasksService _tasksService;
    private readonly IHttpClientFactory _httpClientFactory;

    public TasksController(TasksService tasksService, IHttpClientFactory httpClientFactory)
    {
        _tasksService = tasksService;
        _httpClientFactory = httpClientFactory;
    }

    private async Task<string> GetGoogleAccessTokenAsync()
    {
        var keycloakToken = HttpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);

        if (string.IsNullOrEmpty(keycloakToken))
        {
            throw new UnauthorizedAccessException("No Keycloak token found.");
        }

        var client = _httpClientFactory.CreateClient("GoogleAuthClient");
        var request = new HttpRequestMessage(HttpMethod.Post, "broker/google/token");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", keycloakToken);

        var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var tokenResponse = await response.Content.ReadFromJsonAsync<GoogleTokenResponse>();
        return tokenResponse?.AccessToken ?? throw new Exception("Failed to retrieve Google access token.");
    }

    [HttpGet("lists")]
    public async Task<IActionResult> GetTaskLists()
    {
        try
        {
            var accessToken = await GetGoogleAccessTokenAsync();
            var lists = await _tasksService.GetTaskListsAsync(accessToken);
            return Ok(lists);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("lists/{taskListId}/tasks")]
    public async Task<IActionResult> GetTasks(string taskListId)
    {
        try
        {
            var accessToken = await GetGoogleAccessTokenAsync();
            var tasks = await _tasksService.GetTasksAsync(accessToken, taskListId);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("lists/{taskListId}/tasks/{taskId}")]
    public async Task<IActionResult> GetTask(string taskListId, string taskId)
    {
        try
        {
            var accessToken = await GetGoogleAccessTokenAsync();
            var task = await _tasksService.GetTaskAsync(accessToken, taskListId, taskId);
            if (task == null) return NotFound();
            return Ok(task);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("lists/{taskListId}/tasks")]
    public async Task<IActionResult> CreateTask(string taskListId, [FromBody] GoogleTask task)
    {
        try
        {
            var accessToken = await GetGoogleAccessTokenAsync();
            var createdTask = await _tasksService.CreateTaskAsync(accessToken, taskListId, task);
            return Ok(createdTask);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("lists/{taskListId}/tasks/{taskId}")]
    public async Task<IActionResult> UpdateTask(string taskListId, string taskId, [FromBody] GoogleTask task)
    {
        try
        {
            var accessToken = await GetGoogleAccessTokenAsync();
            var updatedTask = await _tasksService.UpdateTaskAsync(accessToken, taskListId, taskId, task);
            return Ok(updatedTask);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("lists/{taskListId}/tasks/{taskId}")]
    public async Task<IActionResult> DeleteTask(string taskListId, string taskId)
    {
        try
        {
            var accessToken = await GetGoogleAccessTokenAsync();
            await _tasksService.DeleteTaskAsync(accessToken, taskListId, taskId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    private class GoogleTokenResponse
    {
        [System.Text.Json.Serialization.JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }
    }
}
