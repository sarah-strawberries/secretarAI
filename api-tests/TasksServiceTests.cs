using Moq;
using Moq.Protected;
using NUnit.Framework;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using api.Services;
using api.Models.GoogleModels;
using System.Collections.Generic;
using System.Text.Json;

namespace api_tests;

public class TasksServiceTests
{
    private Mock<HttpMessageHandler> _httpMessageHandlerMock;
    private HttpClient _httpClient;
    private TasksService _tasksService;

    [SetUp]
    public void Setup()
    {
        _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_httpMessageHandlerMock.Object);
        _tasksService = new TasksService(_httpClient);
    }

    // [TearDown]
    // public void TearDown()
    // {
    //     _httpClient.Dispose();
    // }

    [Test]
    public async Task GetTaskListsAsync_ReturnsTaskLists_WhenResponseIsSuccess()
    {
        // Arrange
        var expectedResponse = new GoogleTaskListResponse
        {
            Items = new List<GoogleTaskList>
            {
                new GoogleTaskList { Id = "list1", Title = "List 1" },
                new GoogleTaskList { Id = "list2", Title = "List 2" }
            }
        };

        var jsonResponse = JsonSerializer.Serialize(expectedResponse);

        _httpMessageHandlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(jsonResponse)
            });

        // Act
        var result = await _tasksService.GetTaskListsAsync("fake-token");

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Count, Is.EqualTo(2));
        Assert.That(result[0].Id, Is.EqualTo("list1"));
        Assert.That(result[1].Title, Is.EqualTo("List 2"));
    }

    [Test]
    public async Task GetTasksAsync_ReturnsTasks_WhenResponseIsSuccess()
    {
        // Arrange
        var expectedResponse = new GoogleTaskResponse
        {
            Items = new List<GoogleTask>
            {
                new GoogleTask { Id = "task1", Title = "Task 1" },
                new GoogleTask { Id = "task2", Title = "Task 2" }
            }
        };

        var jsonResponse = JsonSerializer.Serialize(expectedResponse);

        _httpMessageHandlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(jsonResponse)
            });

        // Act
        var result = await _tasksService.GetTasksAsync("fake-token", "list1");

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Count, Is.EqualTo(2));
        Assert.That(result[0].Id, Is.EqualTo("task1"));
    }

    [Test]
    public async Task GetTaskAsync_ReturnsTask_WhenResponseIsSuccess()
    {
        // Arrange
        var expectedTask = new GoogleTask { Id = "task1", Title = "Task 1" };
        var jsonResponse = JsonSerializer.Serialize(expectedTask);

        _httpMessageHandlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(jsonResponse)
            });

        // Act
        var result = await _tasksService.GetTaskAsync("fake-token", "list1", "task1");

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo("task1"));
        Assert.That(result.Title, Is.EqualTo("Task 1"));
    }

    [Test]
    public async Task GetTaskAsync_ReturnsNull_WhenResponseIsNotFound()
    {
        // Arrange
        _httpMessageHandlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.NotFound
            });

        // Act
        var result = await _tasksService.GetTaskAsync("fake-token", "list1", "task1");

        // Assert
        Assert.That(result, Is.Null);
    }
}
