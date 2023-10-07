namespace Qinqii.DTOs.Request.User;

public class UpdateProfileRequest
{
    public int user_id { get; set; }
    public string name { get; set; }
    public IFormFile? background { get; set; }
    public IFormFile? avatar { get; set; }
}