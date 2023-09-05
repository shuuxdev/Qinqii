using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Qinqii.Models;
using Qinqii.Models.Attributes;


public class CreateCommentRequest
{
    [BindNever]
    [IgnoreDapperParameter]
    public List<AttachmentInsertTVP> attachment_links { get; set; } = new();
    [IgnoreDapperParameter]
    public IFormFileCollection? attachments { get; set; }
    public int post_id { get; set; }
    public string content { get; set; }
    public int? parent_id { get; set; }
    public int user_id { get; set; }

}