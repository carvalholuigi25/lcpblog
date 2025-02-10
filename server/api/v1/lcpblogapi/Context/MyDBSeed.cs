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

    public void Seed(bool isseed = false)
    {
        if (isseed)
        {
            _modelBuilder.Entity<User>().HasData(MyDBFunctions.GetNewUsersData());
            _modelBuilder.Entity<Post>().HasData(MyDBFunctions.GetNewPostsData());
        }
    }
}
