using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using Qinqii.Models;
using Qinqii.Models.Attributes;
using Qinqii.Models.Type;


public class CreatePostRequest
{
  
        [BindRequired]
        public string content { get; set; }
        public int user_id { get; set; }
}