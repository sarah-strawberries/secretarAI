namespace api.Models;

public class DailySchedule
{
    public int Id { get; set; }
    public int BulletTypeId { get; set; }
    public DateOnly ScheduleDate { get; set; }
    public int AccountId { get; set; }
}
