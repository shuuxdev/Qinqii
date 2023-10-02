using System.Data;
using Qinqii.Models;
using Qinqii.Models.Interfaces;
using Qinqii.Models.Paging;
using Qinqii.Utilities;

namespace Qinqii.Repositories;

public class StoryRepository : IRepository<Story>
{
    private readonly QueryHelper _query;

    public StoryRepository(QueryHelper query)
    {
        _query = query;
    }
    
    public Task<Story> GetById(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Story>> GetAll(Page page)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Story>> GetAll()
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<Story>> GetAll(Page page, int user_id, CancellationToken token)
    {
        var param = page.ToParameters();
        param.Add("@user_id", user_id, DbType.Int32);
        var stories = await _query.QueryMultipleAsync<IEnumerable<Story>>("[STORY].GetAll", param);
        return stories;
    }

    public Task<Story> Create(Story entity)
    {
        throw new NotImplementedException();
    }

    public Task<Story> Update(Story entity)
    {
        throw new NotImplementedException();
    }

    public Task<Story> Delete(int id)
    {
        throw new NotImplementedException();
    }
}