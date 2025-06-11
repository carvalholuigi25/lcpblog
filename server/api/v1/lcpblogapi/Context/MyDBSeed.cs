using lcpblogapi.Models;
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
            _modelBuilder.Entity<LoginStatus>().HasData(MyDBFunctions.GetNewLoginStatusData());
            _modelBuilder.Entity<Media>().HasData(MyDBFunctions.GetNewMediaData());
        }
    }
}
