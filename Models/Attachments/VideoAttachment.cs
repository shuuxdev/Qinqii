using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Qinqii.Models.Attachments;

public class VideoAttachment
{
    public IFormFile video { get; set; }
    public const string type = "VIDEO";
    public ImageAttachment thumbnail { get; set; }
}