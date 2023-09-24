namespace Qinqii.DTOs.Request.User;

public class ChangeAvatarRequest
{
    public int user_id { get; set; }
    public IFormFile avatar { get; set; }
}