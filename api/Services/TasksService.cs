using System.Net.Http.Headers;
using System.Net.Http.Json;
using api.Models;
using api.Models.GoogleModels;

namespace api.Services;

public class TasksService
{
    private readonly HttpClient _httpClient;

    public TasksService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<GoogleTaskList>> GetTaskListsAsync(string accessToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "https://tasks.googleapis.com/tasks/v1/users/@me/lists");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<GoogleTaskListResponse>();
        return result?.Items ?? new List<GoogleTaskList>();
    }

    public async Task<List<GoogleTask>> GetTasksAsync(string accessToken, string taskListId)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"https://tasks.googleapis.com/tasks/v1/lists/{taskListId}/tasks");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<GoogleTaskResponse>();
        return result?.Items ?? new List<GoogleTask>();
    }

    public async Task<GoogleTask?> GetTaskAsync(string accessToken, string taskListId, string taskId)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"https://tasks.googleapis.com/tasks/v1/lists/{taskListId}/tasks/{taskId}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<GoogleTask>();
    }

    public async Task<GoogleTask?> CreateTaskAsync(string accessToken, string taskListId, GoogleTask task)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"https://tasks.googleapis.com/tasks/v1/lists/{taskListId}/tasks");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Content = JsonContent.Create(task);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<GoogleTask>();
    }

    public async Task<GoogleTask?> UpdateTaskAsync(string accessToken, string taskListId, string taskId, GoogleTask task)
    {
        var request = new HttpRequestMessage(HttpMethod.Put, $"https://tasks.googleapis.com/tasks/v1/lists/{taskListId}/tasks/{taskId}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Content = JsonContent.Create(task);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<GoogleTask>();
    }

    public async Task DeleteTaskAsync(string accessToken, string taskListId, string taskId)
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, $"https://tasks.googleapis.com/tasks/v1/lists/{taskListId}/tasks/{taskId}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }
}
