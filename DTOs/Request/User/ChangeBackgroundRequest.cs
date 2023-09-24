namespace Qinqii.DTOs.Request.User;

public class ChangeBackgroundRequest
{
    public int user_id { get; set; }
    public IFormFile background { get; set; }
}