using Microsoft.Extensions.FileProviders;

public static class WebApplicationExtensions {
    public static void UseWebroot(this WebApplication app, WebApplicationBuilder builder, string path = @"dist")
    {
        if (app.Environment.IsProduction())
        {
            app.Logger.LogInformation("Production Mode");
            var newPathProvider =
                new PhysicalFileProvider(Path.Combine("/var/www/Qinqii/wwwroot/", path));
            var webRootProvider =
                new PhysicalFileProvider("/var/www/Qinqii/wwwroot/");
            var compositeProvider =
                new CompositeFileProvider(webRootProvider,
                    newPathProvider);
            app.Environment.WebRootFileProvider = compositeProvider;
        }
        else
        {
            var newPathProvider =
                new PhysicalFileProvider(Path.Combine(app.Environment.WebRootPath, path));
            var webRootProvider =
                new PhysicalFileProvider(app.Environment.WebRootPath);
            var compositeProvider =
                new CompositeFileProvider(webRootProvider,
                    newPathProvider);
            app.Environment.WebRootFileProvider = compositeProvider;
        }
       
    }
}