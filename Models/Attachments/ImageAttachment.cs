namespace Qinqii.Models.Attachments;

public class ImageAttachment
{
    public IFormFile image { get; set; }
    public const string type = "IMAGE";
}