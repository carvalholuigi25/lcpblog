using lcpblogapi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace lcpblogapi.Context;

public class MyDBContextSQLServer : MyDBContext
{
    private readonly IConfiguration _config;

    public MyDBContextSQLServer(DbContextOptions<MyDBContextSQLServer> options, IConfiguration config, ILogger<MyDBContext> logger) : base(options, config)
    {
        _config = config;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var enableSeedDataDef = Convert.ToBoolean(_config.GetSection("SeedDataDefDB").Value!.ToString() ?? "false");

        if (!optionsBuilder.IsConfigured)
        {
            if (!!enableSeedDataDef)
            {
                optionsBuilder.UseSqlServer(_config.GetConnectionString("SQLServer")!)
                .UseSeeding(MyDBFunctions.GenSeedData)
                .UseAsyncSeeding(MyDBFunctions.GenSeedAsyncData)
                .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
                .EnableDetailedErrors();
            }
            else
            {
                optionsBuilder.UseSqlServer(_config.GetConnectionString("SQLServer")!)
                .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
                .EnableDetailedErrors();
            }
        }

        base.OnConfiguring(optionsBuilder);
    }
}