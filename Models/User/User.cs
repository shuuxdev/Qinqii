
using Newtonsoft.Json;

namespace Qinqii.Models {
    public class User {
      
        public string user_id {get;set;}

        public string name {get;set;}        
        
        public string avatar {get;set;}

        public string background {get;set;}

        

        public DateTime date_of_birth {get;set;}

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string error {get;set;}
    }
}