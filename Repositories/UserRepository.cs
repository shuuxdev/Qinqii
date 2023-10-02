using Dapper;
using Qinqii.Models;
using Qinqii.Models.Interfaces;
using Qinqii.Models.Paging;
using Qinqii.Utilities;

namespace Qinqii.Repositories;

public class UserRepository : IRepository<User>
{
    private readonly DapperContext _ctx;

    public UserRepository(DapperContext ctx)
    {
        
        _ctx = ctx;
    }
    public Task<User> GetById(int id)
    {
        
        throw new NotImplementedException();
    }

    public Task<IEnumerable<User>> GetAll(Page page)
    {
        using var connection = _ctx.CreateConnection();
        var param = page.ToParameters();
        var reader = (connection.QueryMultipleAsync("[USER].[GetAll]", commandType: System.Data.CommandType.StoredProcedure, param: param));
        throw new NotImplementedException();
    }

    public Task<IEnumerable<User>> GetAll()
    {
        throw new NotImplementedException();
    }

    public Task<User> Create(User entity)
    {
        throw new NotImplementedException();
    }

    public Task<User> Update(User entity)
    {
        throw new NotImplementedException();
    }

    public Task<User> Delete(int id)
    {
        throw new NotImplementedException();
    }
}