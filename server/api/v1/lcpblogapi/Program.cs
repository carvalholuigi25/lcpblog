using AspNetCoreRateLimit;
using lcpblogapi.Authorization;
using lcpblogapi.Context;
using lcpblogapi.Helpers;
using lcpblogapi.Hubs;
using lcpblogapi.Interfaces;
using lcpblogapi.Localization;
using lcpblogapi.Operations;
using lcpblogapi.Repositories;
using lcpblogapi.Services;
using lcpblogapi.library.MyFunctions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Localization;
using NSwag;
using NSwag.Generation.Processors.Security;
using Serilog;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using lcpblogapi.Models.Enums;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;
var env = builder.Environment;

var logger = new LoggerConfiguration()
    .ReadFrom.Configuration(config)
    .Enrich.FromLogContext()
    .CreateLogger();

var automigruntime = false;

builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

switch (config.GetSection("DefDBMode").Value)
{
    case "SQLite":
        builder.Services.AddDbContext<MyDBContext, MyDBContextSQLite>();
        break;
    case "SQLServer":
        builder.Services.AddDbContext<MyDBContext, MyDBContextSQLServer>();
        break;
    case "MySQL":
        builder.Services.AddDbContext<MyDBContext, MyDBContextMySQL>();
        break;
    case "PostgresSQL":
        builder.Services.AddDbContext<MyDBContext, MyDBContextPostgresSQL>();
        break;
    default:
        builder.Services.AddDbContext<MyDBContext>();
        break;
}

builder.Services.AddCors();

builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddControllers()
    .AddJsonOptions(x => {
        x.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("BannedOnly", policy => policy.RequireRole(EUsersRoles.banned.ToString()));
    options.AddPolicy("GuestOnly", policy => policy.RequireRole(EUsersRoles.guest.ToString()));
    options.AddPolicy("UsersOnly", policy => policy.RequireRole(EUsersRoles.user.ToString()));
    options.AddPolicy("TeamMembersOnly", policy => policy.RequireRole(EUsersRoles.member.ToString()));
    options.AddPolicy("EditorOnly", policy => policy.RequireRole(EUsersRoles.editor.ToString()));
    options.AddPolicy("VipOnly", policy => policy.RequireRole(EUsersRoles.vip.ToString()));
    options.AddPolicy("StaffOnly", policy => policy.RequireRole(EUsersRoles.moderator.ToString(), EUsersRoles.admin.ToString()));
    options.AddPolicy("AllUsers", policy => policy.RequireRole(EUsersRoles.guest.ToString(), EUsersRoles.user.ToString(), EUsersRoles.member.ToString(), EUsersRoles.editor.ToString(), EUsersRoles.vip.ToString(), EUsersRoles.moderator.ToString(), EUsersRoles.admin.ToString()));
});

builder.Services.AddOpenApiDocument(options => {
     options.PostProcess = document =>
     {
         document.Info = new OpenApiInfo
         {
             Version = "v1",
             Title = "LCPBlog Api",
             Description = "LCPBlogApi",
             TermsOfService = "https://localhost:5000/terms",
             Contact = new OpenApiContact
             {
                 Name = "LCP Contacts",
                 Url = "https://localhost:5000/contacts"
             },
             License = new OpenApiLicense
             {
                 Name = "LCP License",
                 Url = "https://localhost:5000/license"
             }
         };
     };

    options.AddSecurity("Bearer", Enumerable.Empty<string>(), new OpenApiSecurityScheme
    {
        Type = OpenApiSecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        BearerFormat = "JWT", 
        Description = "Type into the textbox: {your JWT token}."
    });

    options.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("Bearer"));
    options.OperationProcessors.Add(new ExcludeSpecificActionsProcessor());
});

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

builder.Services.Configure<AppSettings>(config.GetSection("AppSettings"));
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));

builder.Services.AddLocalization();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddMemoryCache();
builder.Services.AddInMemoryRateLimiting();

builder.Services.AddScoped<MyDBSQLFunctions>();
builder.Services.AddScoped<IUsersRepo, UsersRepo>();
builder.Services.AddScoped<IPostsRepo, PostsRepo>();
builder.Services.AddScoped<ICategoriesRepo, CategoriesRepo>();
builder.Services.AddScoped<ICommentsRepo, CommentsRepo>();
builder.Services.AddScoped<ITagsRepo, TagsRepo>();
builder.Services.AddScoped<IJwtUtils, JwtUtils>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddSingleton<LocalizationMiddleware>();
builder.Services.AddSingleton<IStringLocalizerFactory, JsonStringLocalizerFactory>();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

builder.Services.AddSignalR();

var app = builder.Build();

var supportedCultures = await MyFunctions.GetLanguagesCultureList();

var options = new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture(supportedCultures[0], supportedCultures[0]),
    SupportedCultures = supportedCultures,
    SupportedUICultures = supportedCultures,
    RequestCultureProviders = new List<IRequestCultureProvider>
    {
        new QueryStringRequestCultureProvider(),
        new CookieRequestCultureProvider()
    }
};

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    if(automigruntime == true) {
        using var serviceScope = app.Services.CreateScope();
        var dbContext = serviceScope.ServiceProvider.GetRequiredService<MyDBContext>();
        if (dbContext.Database.GetPendingMigrations().Any()) {
            await dbContext.Database.MigrateAsync();
        }
    }
}
else 
{
    app.UseIpRateLimiting();
}

app.UseCors(x => x
    .SetIsOriginAllowed(origin => true)
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("https://localhost:5000", "http://localhost:5001", "http://localhost:3000", "https://localhost:3000")
    .AllowCredentials());

app.UseRequestLocalization(options);
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseAuthentication();

app.UseOpenApi();
app.UseSwaggerUi(settings => 
{
    settings.PersistAuthorization = true;
});
app.MapOpenApi();

app.UseReDoc(options =>
{
    options.Path = "/docs";
});

app.UseMiddleware<LocalizationMiddleware>();
app.UseMiddleware<ErrorHandlerMiddleware>();
app.UseMiddleware<JwtMiddleware>();

app.MapControllers();
app.MapHub<ChatHub>("/chathub");
app.MapHub<DataHub>("/datahub");

app.Run();