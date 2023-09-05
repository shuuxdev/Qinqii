using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Qinqii.Models;

public class AttachmentInsertTVP
{
    [BindNever]
    public string url { get; set; }
    [BindNever]
    public string type { get; set; }
}