namespace api.Models.GoogleModels;

public class GoogleTaskList
{
    public string? Id { get; set; }
    public string? Title { get; set; }
    public string? Updated { get; set; }
    public string? SelfLink { get; set; }
    public string? Kind { get; set; }
    public string? Etag { get; set; }
}

public class GoogleTask
{
    public string? Id { get; set; }
    public string? Title { get; set; }
    public string? Notes { get; set; }
    public string? Status { get; set; }
    public string? Due { get; set; }
    public string? Completed { get; set; }
    public bool? Deleted { get; set; }
    public bool? Hidden { get; set; }
    public string? Parent { get; set; }
    public string? Position { get; set; }
    public string? Updated { get; set; }
    public string? SelfLink { get; set; }
    public string? Kind { get; set; }
    public string? Etag { get; set; }
    public List<GoogleTaskLink>? Links { get; set; }
}

public class GoogleTaskLink
{
    public string? Type { get; set; }
    public string? Description { get; set; }
    public string? Link { get; set; }
}

public class GoogleTaskListResponse
{
    public string? Kind { get; set; }
    public string? Etag { get; set; }
    public string? NextPageToken { get; set; }
    public List<GoogleTaskList>? Items { get; set; }
}

public class GoogleTaskResponse
{
    public string? Kind { get; set; }
    public string? Etag { get; set; }
    public string? NextPageToken { get; set; }
    public List<GoogleTask>? Items { get; set; }
}
