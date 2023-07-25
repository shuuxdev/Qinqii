using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;

namespace Qinqii.Models.Post;
public class AttachmentTVP
{
    [BindNever]

    public string url { get; set; }
    [BindNever]
 
    public string type { get; set; }
}
public class CreatePostDTO
{
        public CreatePostDTO()
        {
            attachment_links = new List<AttachmentTVP>();
        }
        [BindRequired] public string content { get; set; }

        public int author { get; set; }
        public IFormFileCollection attachments { get; set; }

        public List<AttachmentTVP>? attachment_links { get; set; }
}