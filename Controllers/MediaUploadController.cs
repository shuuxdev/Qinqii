using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Qinqii.Models.Attachment;
using Qinqii.Models.Post;
using Qinqii.Service;

namespace Qinqii.Controllers;

[Route("upload")]
public class MediaUploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly UploadService _uploadService;

    public MediaUploadController(IWebHostEnvironment env,
        UploadService uploadService)
    {
        _env = env;
        _uploadService = uploadService;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(
        [FromForm] IFormFileCollection images)
    {
        List<AttachmentTVP> list = new();
        foreach (var image in images)
        {
            var name = Guid.NewGuid().ToString();
            var prefix = Path.GetExtension(image.FileName);
            var url = name + prefix;
            if (image.ContentType.ToLower().StartsWith("image"))
                list.Add(new AttachmentTVP() { type = "IMAGE", url = url });

            using var fileStream =
                new FileStream(Path.Combine(_env.WebRootPath,
                        $"assets/{url}"),
                    FileMode.CreateNew);
            await image.CopyToAsync(fileStream);
        }

        if (list.IsNullOrEmpty()) throw new InvalidDataException();

        var insertedAttachments = await _uploadService.UploadAttachment(list);
        return Ok(insertedAttachments);
    }
}