namespace api.Models;

public class LegaleseSummary
{
    public int Id { get; set; }
    public string PageUrl { get; set; } = string.Empty;
    public DateTime DateSummarized { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string LegaleseInput { get; set; } = string.Empty;
    public int AccountId { get; set; }
}
