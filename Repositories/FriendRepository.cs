using System.Data;
using Dapper;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.User;
using Qinqii.Entities;
using Qinqii.Models;
using Qinqii.Models.Exceptions;
using Qinqii.Models.QueryResult;
using Qinqii.Utilities;

namespace Qinqii.Service;

public class FriendRepository
{
    private DapperContext _ctx;
    private readonly IHubContext<QinqiiHub> _hubContext;

    public FriendRepository(DapperContext ctx, IHubContext<QinqiiHub> hubContext)
    {
        _ctx = ctx;
        _hubContext = hubContext;
    }
    public async Task<QueryResult<GetPeopleYouMayKnowResponse>> GetPeopleYouMayKnow(GetPeopleYouMayKnowRequest request)
    {
        try
        {
            using var connection = _ctx.CreateConnection();
            var param = request.ToParameters();
            var reader = await connection.QueryMultipleAsync("[ACCOUNT].[GetPeopleYouMayKnow]", commandType: CommandType.StoredProcedure, param: param);
            var users = reader.Read<User>();
            var total = reader.Read<int>().FirstOrDefault();
            var queryResult = new QueryResult<GetPeopleYouMayKnowResponse>(new GetPeopleYouMayKnowResponse()
            {
              total  = total,
              users = users
            }, true);
            return queryResult;
        }
        catch (Exception e)
        {
            var queryResult = new QueryResult<GetPeopleYouMayKnowResponse>(new GetPeopleYouMayKnowResponse()
            {
                total  = 0,
                users = null,
            }, false);
            return queryResult;
        }
    }

    public async Task<int> CreateFriendRequest(CreateFriendRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        int request_id = await connection.ExecuteScalarAsync<int>("[ACCOUNT].[SendFriendRequest]", commandType: CommandType.StoredProcedure, param: param);
        if(request_id == 0) throw new FriendRequestConflictException();
        return request_id;
    }
    
    public async Task<int> GetFriendRequestSenderId(int id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@id", id);
        int sender_id = await connection.ExecuteScalarAsync<int>("[ACCOUNT].[GetFriendRequestSenderId]", commandType: CommandType.StoredProcedure, param: param);
        return sender_id;
    }
    public async Task<int> GetFriendRequestReceiverId(int request_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@id", request_id);
        int receiver_id = await connection.ExecuteScalarAsync<int>("[ACCOUNT].[GetFriendRequestReceiverId]", commandType: CommandType.StoredProcedure, param: param);
        return receiver_id;
    }

    public async Task BroadcastFriendRequest(User sender, int receiver_id, int request_id )
    {
        await _hubContext.Clients.User(receiver_id.ToString()).SendAsync("ReceiveFriendRequest", sender, request_id);
    }
    public async Task CancelFriendRequest(CancelFriendRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        await connection.ExecuteAsync("[ACCOUNT].[CancelFriendRequest]", commandType: CommandType.StoredProcedure, param: param);
    }
    public async Task Unfriend(UnfriendRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        await connection.ExecuteAsync("[ACCOUNT].[Unfriend]", commandType: CommandType.StoredProcedure, param: param);
    }
}