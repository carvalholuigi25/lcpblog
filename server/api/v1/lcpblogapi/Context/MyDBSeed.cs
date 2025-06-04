using lcpblogapi.Models;
using lcpblogapi.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace lcpblogapi.Context;

public class MyDBSeed
{
    private readonly ModelBuilder _modelBuilder;

    public MyDBSeed(ModelBuilder modelBuilder)
    {
        _modelBuilder = modelBuilder;
    }

    public void Seed(bool enableSeedDataDef = false)
    {
        if (enableSeedDataDef)
        {
            _modelBuilder.Entity<User>().HasData(MyDBFunctions.GetNewUsersData());
            _modelBuilder.Entity<Post>().HasData(MyDBFunctions.GetNewPostsData());
            _modelBuilder.Entity<Category>().HasData(MyDBFunctions.GetNewCategoriesData());
            _modelBuilder.Entity<LoginAttempts>().HasData(MyDBFunctions.GetNewLoginAttemptsStatsData());
        }
    }
}
