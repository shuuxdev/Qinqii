namespace Qinqii.DTOs.Request.User;

public class GetPeopleYouMayKnowRequest
{
    public int user_id { get; set; }
    public int page { get; set; }
    public int page_size { get; set; }
}