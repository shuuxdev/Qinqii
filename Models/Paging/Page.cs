using Qinqii.Models.Attributes;

namespace Qinqii.Models.Paging;

public class Page
{
    private const int MAX_PAGE_SIZE = 50;
    private int PAGE_SIZE = 10;
    [ParameterName("page")]
    public int PageNumber { get; set; } = 1;
    [ParameterName("page_size")]
    public int PageSize
    {
        get => PAGE_SIZE;
        set => PAGE_SIZE = Math.Min(value, MAX_PAGE_SIZE);
    }
    
}