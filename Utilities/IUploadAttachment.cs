
using Qinqii.Models;

namespace Qinqii.Utilities;

public abstract class IUploadAttachment
{
    public List<AttachmentInsertTVP> attachment_links { get; set; }
}