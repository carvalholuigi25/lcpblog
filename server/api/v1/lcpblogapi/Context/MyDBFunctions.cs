using lcpblogapi.Models;
using lcpblogapi.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace lcpblogapi.Context;

public static class MyDBFunctions
{
    public static void GenSeedData(DbContext context, bool _)
    {
        var newdata = context.Set<User>().FirstOrDefault(b => b.Username == "admin");
        if (newdata == null)
        {
            context.Set<User>().AddRange(GetNewUsersData());
            context.Set<Post>().AddRange(GetNewPostsData());
            context.Set<Category>().AddRange(GetNewCategoriesData());
            context.Set<LoginAttempts>().AddRange(GetNewLoginAttemptsStatsData());
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
            context.Set<Category>().AddRange(GetNewCategoriesData());
            context.Set<LoginAttempts>().AddRange(GetNewLoginAttemptsStatsData());
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

    public static Post[] GetNewPostsData()
    {
        return [
            new Post() {
                PostId = 1,
                Title = "Welcome to LCPBlog!",
                Content = "Welcome to LCPBlog!",
                Image = "blog.jpg",
                Slug = "/",
                Views = 0,
                ViewsCounter = 0,
                CreatedAt = DateTimeOffset.Now,
                UpdatedAt = DateTimeOffset.Now,
                Status = EPostStatus.all,
                UserId = 1
            }
        ];
    }

    public static Category[] GetNewCategoriesData()
    {
        return [
            new Category() {
                CategoryId = 1,
                Name = "Geral",
                Slug = "/geral",
                Status = ECategoryStatus.all,
                CreatedAt = DateTimeOffset.Now,
                UpdatedAt = DateTimeOffset.Now
            },
            new Category() {
                CategoryId = 2,
                Name = "Tecnologia",
                Slug = "/tecnologia",
                Status = ECategoryStatus.all,
                CreatedAt = DateTimeOffset.Now,
                UpdatedAt = DateTimeOffset.Now
            },
            new Category() {
                CategoryId = 3,
                Name = "Outros",
                Slug = "/outros",
                Status = ECategoryStatus.all,
                CreatedAt = DateTimeOffset.Now,
                UpdatedAt = DateTimeOffset.Now
            }
        ];
    }
    
    public static LoginAttempts[] GetNewLoginAttemptsStatsData() {
        return [
            new LoginAttempts() {
                LoginAttemptId = 1,
                Attempts = 0,
                Status = ELoginAttemptsStatus.unlocked,
                DateLock = DateTime.UtcNow.AddHours(1),
                DateLockTimestamp = new DateTimeOffset(DateTime.UtcNow.AddHours(1)).ToUnixTimeSeconds(),
                UserId = 1
            }
        ];
    }
}