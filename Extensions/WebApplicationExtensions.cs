using Microsoft.Extensions.FileProviders;

public static class WebApplicationExtensions {
    public static void UseWebroot(this WebApplication app, WebApplicationBuilder builder, string path)
    {
         var newPathProvider =
        new PhysicalFileProvider(
        Path.Combine(builder.Environment.WebRootPath, path));
        var webRootProvider =
        new PhysicalFileProvider(builder.Environment.WebRootPath);
        var compositeProvider =
        new CompositeFileProvider(webRootProvider,
                                newPathProvider);
        app.Environment.WebRootFileProvider = compositeProvider;
    }
}