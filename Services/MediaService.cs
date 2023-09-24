using System.Data;
using Dapper;
using Qinqii.Models;
using Qinqii.Models.Attachments;
using Qinqii.Utilities;

namespace Qinqii.Service;

public class MediaService
{
    private readonly DapperContext _ctx;

    public MediaService(DapperContext ctx)
    {
        _ctx = ctx;
    }
    public async Task<IEnumerable<int>> UploadVideoAndThumbnail(List<VideoTVP> videos)
    {
        var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@videos", videos.ToTableValuedParameters());

        var attachments_ids = await connection.QueryAsync<int>("dbo.INSERT_Videos_And_Thumbnails",
            param: param,
            commandType: CommandType.StoredProcedure);
        return attachments_ids;
    }
    public async Task<IEnumerable<int>> UploadImages(List<PhotoTVP> images)
    {
        var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@images", images.ToTableValuedParameters());

        var attachments_ids = await connection.QueryAsync<int>("dbo.INSERT_Images",
            param: param,
            commandType: CommandType.StoredProcedure);
        return attachments_ids;
    }
} 