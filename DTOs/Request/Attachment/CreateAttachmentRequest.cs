using Qinqii.Models;

namespace Qinqii.DTOs.Request.Attachment;

public class CreateAttachmentRequest
{
    public List<AttachmentInsertTVP> attachments { get; set; }
}