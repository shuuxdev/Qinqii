using System.Data;
using System.Reflection;
using Dapper;
using Qinqii.Enums;
using Qinqii.Models.Attributes;

namespace Qinqii.Utilities;

public static class QinqiiSqlHelper
{
    
    public static DynamicParameters 
        ToParameters<T>(this T obj)
    {
        var param = new DynamicParameters();
        var properties = obj.GetType().GetProperties();
        foreach (var property in properties)
        {
            var ignore = property.GetCustomAttribute<IgnoreDapperParameter>()
             != null;
            if (ignore) continue;
            var customParamName = property.GetCustomAttribute<ParameterName>();
            
            if(customParamName != null)
            {
                param.Add($"@{customParamName.Name}", property.GetValue(obj));
                continue;
            }
            var value = property.GetValue(obj);
            param.Add($"@{property.Name}", value);
        }
        return param;
    }
  
    public static SqlMapper.ICustomQueryParameter ToTableValuedParameters<T>
        (this IEnumerable<T> list)
    {
        var dt = new DataTable();
        var properties = typeof(T).GetProperties();
        foreach(var property in properties)
        {
            var customParamName = property.GetCustomAttribute<ParameterName>();
            if(customParamName != null)
            {
                dt.Columns.Add(customParamName.Name, property.PropertyType);
                continue;
            }
            dt.Columns.Add(property.Name, property.PropertyType );
        }
        foreach(var item in list)
        {
            var row = dt.NewRow();
            foreach(var property in properties)
            {
                var customParamName = property.GetCustomAttribute<ParameterName>();
                if(customParamName != null)
                {
                    row[customParamName.Name] = property.GetValue(item);
                    continue;
                }
                row[property.Name] = property.GetValue(item);
            }
            dt.Rows.Add(row);
        }
        return dt.AsTableValuedParameter();
    }
    
    

    
}