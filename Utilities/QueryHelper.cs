using System.Data;
using System.Reflection;
using Dapper;
using Qinqii.Extensions;
using Qinqii.Utilities;

namespace Qinqii.Models;
public enum ResultType
{
    Single,
    Multiple,
    None
}

public class QueryHelper
{
    private readonly DapperContext _ctx;

    public QueryHelper(DapperContext ctx)
    {
        _ctx = ctx;
    }
    
    public  async Task<T> QueryMultipleAsync<T>( string sql, DynamicParameters param) 
    {
        try
        {
            using  var connection = _ctx.CreateConnection(); 
            var reader = await connection.QueryMultipleAsync(sql, commandType: CommandType.StoredProcedure, param: param);
            System.Type type = typeof(ReaderMappingExtensions);
            string entityType = "To";
            if (Reflection.CheckIfEnumerable(typeof(T)))
            {
                 entityType += typeof(T).GetGenericArguments()[0].Name;
                if(entityType[entityType.Length - 1] == 'y')
                    entityType = entityType.Remove(entityType.Length - 1) + "ies";
                else
                    entityType += "s";
                
            }
            else 
            entityType += typeof(T).Name;
            MethodInfo method = type.GetMethod(entityType);
            if(method != null)
            {
                var result = (Task<T>)method.Invoke(null, new object?[]{reader});
                return await result;                           
            }
            else
                throw new Exception("Method not found");
        } catch(Exception e)
        {
            Console.WriteLine(e.Message);
            throw;
        }
           
    }
   
    public async Task<T> QuerySingleAsync<T>(string sql, DynamicParameters param)
    {
        using var connection = _ctx.CreateConnection();
        var result = await connection.QuerySingleAsync<T>(sql, commandType: CommandType.StoredProcedure, param: param);
        return result;
    }
    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, DynamicParameters param)
    {
        using var connection = _ctx.CreateConnection();
        var result = await connection.QueryAsync<T>(sql, commandType: CommandType.StoredProcedure, param: param);
        return result;
    }
    public async Task ExecuteAsync(string sql, DynamicParameters param)
    {
        using var connection = _ctx.CreateConnection();
        await connection.ExecuteAsync(sql, commandType: CommandType.StoredProcedure, param: param);
    }
}