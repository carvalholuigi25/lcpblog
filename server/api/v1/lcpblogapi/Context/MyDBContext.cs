using lcpblogapi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace lcpblogapi.Context;

public class MyDBContext : DbContext
{
    private readonly IConfiguration _config;

    public MyDBContext(DbContextOptions options, IConfiguration config)
        : base(options)
    {
        _config = config;
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Post> Posts { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Tag> Tags { get; set; } = null!;
    public DbSet<PostCategory> PostCategories { get; set; } = null!;
    public DbSet<PostTag> PostTags { get; set; } = null!;
    public DbSet<FileMetadata> FilesMetadata { get; set; } = null!;
    public DbSet<Schedules> Schedule { get; set; } = null!;
    public DbSet<LoginAttempts> LoginAttempts { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var defdbm = _config.GetSection("DefDBMode").Value ?? "MemoryDB";
        var enableSeedDataDef = Convert.ToBoolean(_config.GetSection("SeedDataDefDB").Value!.ToString() ?? "false");

        if (!optionsBuilder.IsConfigured)
        {
            if (defdbm == "MemoryDB")
            {
                if (!!enableSeedDataDef)
                {
                    optionsBuilder.UseInMemoryDatabase("DBContext")
                    .UseSeeding(MyDBFunctions.GenSeedData)
                    .UseAsyncSeeding(MyDBFunctions.GenSeedAsyncData)
                    .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
                    .EnableDetailedErrors();
                }
                else
                {
                    optionsBuilder.UseInMemoryDatabase("DBContext")
                    .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))
                    .EnableDetailedErrors();
                }
            }
        }

        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var enableSeedDataDef = Convert.ToBoolean(_config.GetSection("SeedDataDefDB").Value!.ToString() ?? "false");

        base.OnModelCreating(modelBuilder);
        new MyDBSeed(modelBuilder).Seed(enableSeedDataDef);
        new MyDBRelationships(modelBuilder).DoIt();
    }
}