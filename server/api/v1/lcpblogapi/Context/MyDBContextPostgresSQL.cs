using lcpblogapi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace lcpblogapi.Context;

public class MyDBContextPostgresSQL : MyDBContext
{
    private readonly IConfiguration _config;

    public MyDBContextPostgresSQL(DbContextOptions<MyDBContextPostgresSQL> options, IConfiguration config) : base(options, config)
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
                optionsBuilder.UseNpgsql(_config.GetConnectionString("PostgresSQL")!)
                .UseSeeding(MyDBFunctions.GenSeedData)
                .UseAsyncSeeding(MyDBFunctions.GenSeedAsyncData)
                .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
                .EnableDetailedErrors();
            }
            else
            {
                optionsBuilder.UseNpgsql(_config.GetConnectionString("PostgresSQL")!)
                .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
                .EnableDetailedErrors();
            }
        }

        base.OnConfiguring(optionsBuilder);
    }
}