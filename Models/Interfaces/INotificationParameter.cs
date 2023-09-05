using Qinqii.Models.Attributes;

namespace Qinqii.Models.Interfaces;

 public interface INotificationParameter
 {
     [ParameterName("param_name")]
     public string name { get; set; }
     [ParameterName("param_value")]
     public string value { get; set; }
 }