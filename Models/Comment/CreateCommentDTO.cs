using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Qinqii.Models.Attachment;
using Qinqii.Models.Post;

namespace Qinqii.Models.Comment;

public class CreateCommentDTO
{
    
    public CreateCommentDTO()
    {
        attachment_links = new List<AttachmentTVP>();
    }
    [BindNever] // không hoạt động với [ApiController] vì bị override
    public List<AttachmentTVP> attachment_links { get; set; }
    public IFormFileCollection? attachments { get; set; }
    public int post_id { get; set; }
    public string content { get; set; }
    public int? parent_comment_id { get; set; } = null;

}