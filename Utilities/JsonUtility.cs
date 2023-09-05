using Newtonsoft.Json;

namespace Qinqii.Ultilities;

public static class JsonUtility {

    public static string JsonWithIgnore(object obj, IEnumerable<string> ignore_list)
    {
        return JsonConvert.SerializeObject(obj, new JsonSerializerSettings(){
            ContractResolver = new IgnorePropertiesResolver( ignore_list)
        });
    }
}