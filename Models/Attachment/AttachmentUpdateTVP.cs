using System.Diagnostics.CodeAnalysis;
using Qinqii.Enums;

namespace Qinqii.Models.Attachment;

public class AttachmentUpdateTVP
{
    public int? attachment_id { get; set; }
    public string? attachment_link { get; set; }
    public string? attachment_type { get; set; }
    public string action { get; set; }
 
}