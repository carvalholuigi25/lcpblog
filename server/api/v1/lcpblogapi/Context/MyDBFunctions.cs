using lcpblogapi.Models;
using lcpblogapi.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace lcpblogapi.Context;

public static class MyDBFunctions {
    public static void GenSeedData(DbContext context, bool _) 
    {
        var newdata = context.Set<User>().FirstOrDefault(b => b.Username == "admin");
        if (newdata == null)
        {
            context.Set<User>().AddRange(GetNewUsersData());
            context.Set<Post>().AddRange(GetNewPostsData());
            context.SaveChanges();
        }
    }

    public static async Task GenSeedAsyncData(DbContext context, bool _, CancellationToken cancellationToken) 
    {
        var newdata = await context.Set<User>().FirstOrDefaultAsync(b => b.Username == "admin", cancellationToken);
        if (newdata == null)
        {
            context.Set<User>().AddRange(GetNewUsersData());
            context.Set<Post>().AddRange(GetNewPostsData());
            await context.SaveChangesAsync(cancellationToken);
        }
    }

    public static User[] GetNewUsersData()
    {
        return [
            new User() {
                UserId = 1,
                Username = "admin",
                Password = BCrypt.Net.BCrypt.HashPassword("1234", 10, false),
                Email = "luiscarvalho239@gmail.com",
                DisplayName = "Luis Carvalho",
                Avatar = "avatars/luis.jpg",
                Cover = "covers/luis.jpg",
                About = "Luis Carvalho",
                Role = EUsersRoles.admin,
                Privacy = EUserPrivacy.all
            }
        ];
    }

    public static Post[] GetNewPostsData() {
        return [
            new Post() {
                PostId = 1,
                Title = "Welcome to LCPBlog!",
                Content = "Welcome to LCPBlog!",
                Image = "blog.jpg",
                Slug = "/",
                CreatedAt = DateTimeOffset.Now,
                UpdatedAt = DateTimeOffset.Now,
                Status = EPostStatus.all,
                UserId = 1
            }
        ];
    }
}