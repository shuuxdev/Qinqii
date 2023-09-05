using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Qinqii.DTOs.Request.Attachment;
using Qinqii.Models;
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

    [HttpPost]
    public async Task<IActionResult> UploadImage(
        [FromForm] IFormFileCollection attachments)
    {
        List<AttachmentInsertTVP> list = new();
        foreach (var attachment in attachments)
        {
            var name = Guid.NewGuid().ToString();
            var prefix = Path.GetExtension(attachment.FileName);
            var url = name + prefix;
            var fileType = attachment.ContentType.ToLower(); 
            if (fileType.StartsWith("image"))
                list.Add(new AttachmentInsertTVP() { type = "IMAGE", url = url });
            if (fileType.StartsWith("video"))
                list.Add(new AttachmentInsertTVP() { type = "VIDEO", url = url });
            using var fileStream =
                new FileStream(Path.Combine(_env.WebRootPath,
                        $"assets/{url}"),
                    FileMode.CreateNew);
            await attachment.CopyToAsync(fileStream);
        }

        if (list.IsNullOrEmpty()) throw new InvalidDataException();

        var insertedAttachments = await _uploadService.UploadAttachment(new 
        CreateAttachmentRequest(){attachments = list});
        return Ok(insertedAttachments);
    }
}