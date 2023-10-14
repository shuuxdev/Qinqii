namespace Qinqii.DTOs.Request.Comment;

public class GetCommentsOfPostRequest : Paging
{
    public int post_id { get; set; }
}

public class Paging
{
    private const int MaxPageSize = 10;
    private const int DefaultPageSize = 5;
    private const int DefaultPage = 1;
    private int _pageSize = DefaultPageSize;
    public int page_size
    {
        get => _pageSize;
        set => _pageSize = Math.Min(value, MaxPageSize);
    }
    public int page { get; set; } = DefaultPage;
}