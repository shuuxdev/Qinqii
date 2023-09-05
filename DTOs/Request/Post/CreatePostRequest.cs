using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using Qinqii.Models;
using Qinqii.Models.Attributes;


public class CreatePostRequest
{
  
        [BindRequired]
        public string content { get; set; }

        public int user_id { get; set; }
        [IgnoreDapperParameter]
        public IFormFileCollection attachments { get; set; }
        [BindNever]
        [IgnoreDapperParameter]
        public List<AttachmentInsertTVP> attachment_links { get; set; } = new();
}