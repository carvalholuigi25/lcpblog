using lcpblogapi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace lcpblogapi.Context;

public class MyDBContextMySQL : MyDBContext
{
    private readonly IConfiguration _config;

    public MyDBContextMySQL(DbContextOptions<MyDBContextMySQL> options, IConfiguration config) : base(options, config)
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
                optionsBuilder.UseMySql(_config.GetConnectionString("MySQL")!, new MySqlServerVersion(new Version()))
                .UseSeeding(MyDBFunctions.GenSeedData)
                .UseAsyncSeeding(MyDBFunctions.GenSeedAsyncData)
                .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
                .EnableDetailedErrors();
            }
            else
            {
                optionsBuilder.UseMySql(_config.GetConnectionString("MySQL")!, new MySqlServerVersion(new Version()))
                .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
                .EnableDetailedErrors();
            }
        }

        base.OnConfiguring(optionsBuilder);
    }
}