using Microsoft.AspNetCore.Mvc;
using Qinqii.Models.Attachment;
using Qinqii.Models.Comment;

namespace Qinqii.Models.Post;


public class EditPostDTO
{
    public string? content { get; set; }
    public List<AttachmentUpdateTVP> attachments { get; set; }
    public int post_id { get; set; }
}