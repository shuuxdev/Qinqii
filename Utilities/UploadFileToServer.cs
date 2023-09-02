using Qinqii.Models.Post;

namespace Qinqii.Utilities;

public abstract class IUploadAttachment
{
    public List<AttachmentTVP> attachment_links { get; set; }
}


public static class Server
{
    public static async Task<List<AttachmentTVP>> UploadAsync(IFormFileCollection formCollection, string webRootPath)
    {
        List<AttachmentTVP> tvp = new List<AttachmentTVP>(); 
        foreach (IFormFile att in formCollection)
        {
            var suffix = Path.GetExtension(att.FileName);
            var name = Guid.NewGuid().ToString();
            var fileType = att.ContentType.ToLower(); 
            if(fileType.StartsWith("image"))
            tvp.Add(new AttachmentTVP { url = name + suffix, type = "IMAGE" });
            if(fileType.StartsWith("video"))
                tvp.Add(new AttachmentTVP { url = name + suffix, type = "VIDEO" });
            await using var fileStream =
                new FileStream(Path.Combine(webRootPath, $"assets/{name}{suffix}"), FileMode.CreateNew);
            await att.CopyToAsync(fileStream);
        }

        return tvp;
    }
}