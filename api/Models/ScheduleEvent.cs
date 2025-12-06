namespace api.Models;

public class ScheduleEvent
{
    public int Id { get; set; }
    public int ScheduleId { get; set; }
    public string EventName { get; set; } = string.Empty;
    public DateTime StartDatetime { get; set; }
    public DateTime StopDatetime { get; set; }
    public string? Note { get; set; }
}
