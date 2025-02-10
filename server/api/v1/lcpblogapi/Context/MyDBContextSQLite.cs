using lcpblogapi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace lcpblogapi.Context;

public class MyDBContextSQLite : MyDBContext
{   
    private readonly IConfiguration _config;

    public MyDBContextSQLite(DbContextOptions<MyDBContextSQLite> options, IConfiguration config) : base(options, config)
    {
        _config = config;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if(!optionsBuilder.IsConfigured) {
            optionsBuilder.UseSqlite(_config.GetConnectionString("SQLite")!)
            .UseSeeding(MyDBFunctions.GenSeedData)
            .UseAsyncSeeding(MyDBFunctions.GenSeedAsyncData)
            .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
            .EnableDetailedErrors();
        }

        base.OnConfiguring(optionsBuilder);
    }
}