namespace Qinqii.DTOs.Request.User;

public class GetPeopleYouMayKnowResponse
{
    public IEnumerable<Entities.User> users { get; set; }
    public int total { get; set; }
}