using System.Data;
using Dapper;

namespace Qinqii.Utilities;

public static class QinqiiSqlHelper
{
    
   
    public static SqlMapper.ICustomQueryParameter 
    CreateTableValuedParameter<T>(this T obj, ILogger logger)
    {
        DataTable dt = new DataTable();
        
        
        return dt.AsTableValuedParameter();
    }
}