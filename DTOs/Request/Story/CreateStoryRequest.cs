namespace Qinqii.DTOs.Request.Story;

public class CreateStoryRequest
{
    public int user_id { get; set; }
    public int expire_after { get; set; } = 24;
    public string thumbnail { get; set; }
}