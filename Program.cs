using Microsoft.Extensions.FileProviders;
using System.Net.WebSockets;
using System.Diagnostics;
using Qinqii.Models;
using Qinqii.Service;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Microsoft.AspNetCore.HttpLogging;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.OpenApi.Models;
using Qinqii.Middlewares;
using Qinqii.ModelBinders;
using Qinqii.Repositories;
using Qinqii.Utilities;
using Qinqii.Workers;
using PostRepository = Qinqii.Service.PostRepository;
using StoryRepository = Qinqii.Service.StoryRepository;
using UserRepository = Qinqii.Service.UserRepository;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        // Add services to the container.
        builder.Services.AddSignalR();
        
    
        builder.Services.AddControllersWithViews().AddJsonOptions((option) =>
        {
            option.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });
        
        builder.Services.PostConfigure<MvcOptions>(options =>
        {
            var inputFormatters = options.InputFormatters;
            var readerFactory = builder.Services.BuildServiceProvider().GetRequiredService<IHttpRequestStreamReaderFactory>();

            var binderProvider = new UserIdModelBinderProvider(inputFormatters, readerFactory);
            options.ModelBinderProviders.Insert(0, binderProvider);
        });
        
        builder.Services.AddScoped<DapperContext>();
        builder.Services.AddScoped<UserRepository>();
        builder.Services.AddScoped<MessageRepository>();
        builder.Services.AddScoped<FeedRepository>();
        builder.Services.AddScoped<NotificationService>();
        builder.Services.AddScoped<SignalRService>();
        builder.Services.AddScoped<AuthService>();
        builder.Services.AddScoped<StoryRepository>();
        builder.Services.AddScoped<PostRepository>();
        builder.Services.AddScoped<UploadService>();
        builder.Services.AddScoped<FriendRepository>();
        builder.Services.AddScoped<MediaService>();
        builder.Services.AddScoped<CommentRepository>();
        builder.Services.AddSingleton<ConnectionManager>();
        builder.Services.AddScoped<Qinqii.Repositories.PostRepository>();
        builder.Services.AddScoped<Qinqii.Repositories.StoryRepository>();
        builder.Services.AddScoped<QueryHelper>();
        builder.Services.AddTransient<ErrorHandlingMiddleware>();
        builder.Services.AddHostedService<StoryUpdatingWorker>();
        builder.Services.AddScoped<PasswordHasher>();
        builder.Services.AddHttpLogging((option) =>
        {
            option.LoggingFields = HttpLoggingFields.All;
        });
        //Sau này có muốn thay đổi max request body size thì uncomment dòng này
        //Dùng cho trường hợp upload file lớn
        /*builder.Services.Configure<KestrelServerOptions>(options =>
        {
            options.Limits.MaxRequestBodySize = null;  // Unlimited size
        });*/
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1",
                new OpenApiInfo() { Title = "Qinqii", Version = "v1" });
            c.SwaggerDoc("v2", new OpenApiInfo() { Title = "Qinqii", Version = "v2" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                Scheme = "Bearer",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http
            });
            c.ResolveConflictingActions(api => api.First());
            /*c.DocInclusionPredicate((docName, apiDesc) => apiDesc.GroupName == docName);*/
        });
        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            /*.AddGoogle(option =>
            {
                
                option.ClientId = "100968371322-sjj838ql83314m31tunjjnph1o7njtem.apps.googleusercontent.com";
                option.ClientSecret = "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";
            })*/
            .AddJwtBearer(option =>
            {
                option.Events = new JwtBearerEvents()
                {
                    OnAuthenticationFailed = (c) =>
                    {
                        Debug.WriteLine("On Authentication Failed");
                        Debug.WriteLine(c.Exception.Message);
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = (c) =>
                    {
                        var method = c.Request.Method;
                        var path = c.Request.Path.Value;
                        // Debug.WriteLine($"{method}: {path}");
                        // Debug.WriteLine(token);
                        return Task.CompletedTask;
                    },
                    OnMessageReceived = (c) =>
                    {
                        // We have to hook the OnMessageReceived event in order to
                        // allow the JWT authentication handler to read the access
                        // token from the query string when a WebSocket or 
                        // Server-Sent Events request comes in.

                        // Sending the access token in the query string is required due to
                        // a limitation in Browser APIs. We restrict it to only calls to the
                        // SignalR hub in this code.
                        // See https://learn.microsoft.com/aspnet/core/signalr/security#access-token-logging
                        // for more information about security considerations when using
                        // the query string to transmit the access token.
                        var path = c.Request.Path.Value;
                        var method = c.Request.Method;

                        var token = c.Request.Query["access_token"];
                        Debug.WriteLine($"{method}: {path}");
                        Debug.WriteLine(token);
                        if (path == "/chatHub" && !string.IsNullOrEmpty(token))
                            c.Token = token;

                        return Task.CompletedTask;
                    },
                    OnChallenge = (c) =>
                    {
                        Debug.WriteLine("On Challenge");
                        return Task.CompletedTask;
                    },
                    OnForbidden = (c) =>
                    {
                        Debug.WriteLine("On Forbidden");
                        return Task.CompletedTask;
                    }
                };
                option.TokenValidationParameters =
                    new TokenValidationParameters()
                    {
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey =
                            new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(
                                    builder.Configuration["Jwt:Key"])),
                        ValidateLifetime = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true
                    };
            });
        var app = builder.Build();
        // Configure the HTTP request pipeline.
        if (app.Environment.IsProduction())
        {
            app.UseExceptionHandler("/Home/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
          //  app.UseHsts();
        }

        // app.UseHttpLogging();
        //app.UseHttpsRedirection();
        app.UseMiddleware<ErrorHandlingMiddleware>();
        app.UseStaticFiles();
        app.UseWebroot(builder);
        app.UseRouting();
        if (app.Environment.IsDevelopment())
        {
            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append(
                        "Access-Control-Allow-Origin", "*");
                    ctx.Context.Response.Headers.Append(
                        "Access-Control-Allow-Headers",
                        "Origin, X-Requested-With, Content-Type, Accept");
                }
            });
            app.UseCors(cors =>
            {
                cors.WithOrigins("http://localhost:3000").WithOrigins("http://192.168.2.29:3000").AllowAnyHeader()
                    .AllowAnyMethod().AllowCredentials();
            });
        }

        app.UseAuthentication();
        app.UseAuthorization();
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
            c.SwaggerEndpoint("/swagger/v2/swagger.json", "v2");
        });

        app.MapControllerRoute(
            "default",
            "{*url}",
            new { controller = "Home", action = "Index" },
            new { swagger = new IgnoreRouteConstraint("/swagger") }

        );

        app.MapHub<QinqiiHub>("/chatHub");
        app.Run();
    }
}