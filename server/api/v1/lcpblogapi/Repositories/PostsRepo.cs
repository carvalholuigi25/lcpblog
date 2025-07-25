using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lcpblogapi.Context;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;
using lcpblogapi.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Linq.Dynamic.Core;

namespace lcpblogapi.Repositories;

public class PostsRepo : ControllerBase, IPostsRepo
{
    private readonly MyDBContext _context;
    private readonly IHubContext<DataHub> _hub;

    private MyDBSQLFunctions _myDBSQLFunctions;

    public PostsRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions, IHubContext<DataHub> hub)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
        _hub = hub;
    }

    public async Task<ActionResult<IEnumerable<Post>>> GetPosts(QueryParams queryParams)
    {
        var query = _context.Posts.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<Post>
        {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<Post>> GetPost(int? id)
    {
        var post = await _context.Posts.FindAsync(id);

        if (post == null)
        {
            return NotFound();
        }

        return post;
    }

    public async Task<ActionResult<Post>> CreatePost(Post post)
    {
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        await _hub.Clients.All.SendAsync("ReceiveMessage", post);

        return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, post);
    }

    public async Task<IActionResult> PutPost(int? id, Post post)
    {
        if (id != post.PostId)
        {
            return BadRequest();
        }

        _context.Entry(post).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveMessage", post);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PostExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    public async Task<IActionResult> DeletePost(int? id)
    {
        var post = await _context.Posts.FindAsync(id);

        if (post == null)
        {
            return NotFound();
        }

        _context.Posts.Remove(post);
        await _myDBSQLFunctions.ResetAIID("posts", 0);
        await _context.SaveChangesAsync();
        await _hub.Clients.All.SendAsync("ReceiveMessage", post);

        return NoContent();
    }

    public async Task<ActionResult<Post>> UpdateViewsPost(int id, PostViews postViews)
    {
        var istracking = false;
        var post = await _context.Posts.AsNoTracking().Where(x => x.PostId == id).ToListAsync();

        if (!!istracking)
        {
            _context.Entry(post).State = EntityState.Modified;
        }

        try
        {
            var existingPost = !!istracking ? await _context.Posts.FindAsync(id) : await _context.Posts.FirstOrDefaultAsync(x => x.PostId == id);

            existingPost!.PostId = id;
            existingPost!.Title = post[0].Title;
            existingPost!.Content = post[0].Content;
            existingPost!.Image = post[0].Image;
            existingPost!.Slug = post[0].Slug;
            existingPost!.Views = postViews.Views;
            existingPost!.ViewsCounter = postViews.ViewsCounter;
            existingPost!.CategoryId = post[0].CategoryId;
            existingPost!.CreatedAt = post[0].CreatedAt;
            existingPost!.UpdatedAt = post[0].UpdatedAt;
            existingPost!.Status = post[0].Status;
            existingPost!.UserId = post[0].UserId;

            _context.Posts.Update(existingPost!);

            await _context.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveMessage", post);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PostExists(postViews.PostId))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        finally
        {
            _context.ChangeTracker.Clear();
        }

        return NoContent();
    }

    public async Task<ActionResult<IEnumerable<Post>>> GetAllPostsByUserId(int userId, int page = 1, int pageSize = 10)
    {
        // var post = await _context.Posts.Where(p => p.UserId == userId && p.PostId >= 1).ToListAsync();

        // if (post == null)
        // {
        //     return NotFound();
        // }

        // return post;

        QueryParams queryParams = new()
        {
            Page = page,
            PageSize = pageSize,
            SortBy = "userId",
            SortOrder = SortOrderEnum.asc,
            Op = OpEnum.aboveorequal,
            FieldName = "userId",
            Search = "" + userId
        };

        var query = _context.Posts.AsQueryable();

        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<Post>
        {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<IEnumerable<Post>>> GetPostsByTagName(string tagname)
    {
        if (string.IsNullOrEmpty(tagname))
        {
            return BadRequest("Tag name cannot be null or empty.");
        }

        if (!tagname.StartsWith('#'))
        {
            return BadRequest("Tag name must start with '#'.");
        }

        var post = await _context.Posts.Where(p => p.Tags != null && p.Tags.Contains(tagname.ToLower())).ToListAsync();

        if (post == null)
        {
            return NotFound();
        }

        return post;
    }

    public async Task<ActionResult<IEnumerable<dynamic>>> GetArchivePost(int year)
    {
        if (string.IsNullOrEmpty(year.ToString()))
        {
            year = new DateTime().Year;
        }

        var lstposts = await _context.Posts.ToListAsync();
        var qry = year > 0 ? lstposts.Where(y => y.CreatedAt!.Value.Year == year) : lstposts;
        var result = qry.GroupBy(x => x.CreatedAt!.Value.DateTime.Year)
        .ToDictionary(year => year.Key, g => g.GroupBy(x => x.CreatedAt!.Value.DateTime.ToString("MMMM"))
        .ToDictionary(month => month.Key, data => data.Select(tl => new { posts = tl, length = data.Count() })));
        return Ok(result);
    }

    public ActionResult<IEnumerable<Dataset>> GetDatasetPost(int year = 2025, string? lang = "en")
    {
        var ayear = year > 0 ? year : DateTime.Now.Year;
        Dataset data = new()
        {
            DatasetId = 1,
            Year = year,
            Label = GetMonthsLabels(lang),
            Data = [GetTotalPosts(ayear, 1), GetTotalPosts(ayear, 2), GetTotalPosts(ayear, 3), GetTotalPosts(ayear, 4), GetTotalPosts(ayear, 5), GetTotalPosts(ayear, 6), GetTotalPosts(ayear, 7), GetTotalPosts(ayear, 8), GetTotalPosts(ayear, 9), GetTotalPosts(ayear, 10), GetTotalPosts(ayear, 11), GetTotalPosts(ayear, 12)]
        };

        return Ok(data);
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.Posts.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    protected List<string> GetMonthsLabels(string? lang = "pt")
    {
        return lang switch
        {
            "pt" or "pt-PT" or "pt-BR" => ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            _ => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        };
    }

    private int GetTotalPosts(int year = 2025, int month = 1)
    {
        var lstposts = _context.Posts.AsEnumerable();
        lstposts = lstposts.Where(x => new DateTimeOffset(x.CreatedAt!.Value.DateTime).Year == year && new DateTimeOffset(x.CreatedAt!.Value.DateTime).Month == month);
        return lstposts.Count();
    }

    private bool PostExists(int? id)
    {
        return _context.Posts.Any(e => e.PostId == id);
    }

    private static IQueryable<Post> GetFilterData(IQueryable<Post> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.FieldName))
            {
                var op = queryParams.Op!.Value;

                query = queryParams.FieldName switch
                {
                    "title" => query.Where(i =>
                    op == OpEnum.contains ? i.Title!.ToLower().Contains(queryParams.Search.ToLower()) :
                    op == OpEnum.notcontains ? !i.Title!.ToLower().Contains(queryParams.Search.ToLower()) :
                    op == OpEnum.equal ? i.Title!.ToLower().Equals(queryParams.Search.ToLower()) :
                    op == OpEnum.notequal ? !i.Title!.ToLower().Equals(queryParams.Search.ToLower()) :
                    op == OpEnum.startswith ? i.Title!.ToLower().StartsWith(queryParams.Search.ToLower()) :
                    op == OpEnum.endswith ? i.Title!.ToLower().EndsWith(queryParams.Search.ToLower()) :
                    i.Title!.ToLower() == queryParams.Search.ToLower()),
                    "userId" => query.Where(i =>
                    op == OpEnum.aboveorequal ? i.UserId >= int.Parse(queryParams.Search) :
                    op == OpEnum.beloworequal ? i.UserId <= int.Parse(queryParams.Search) :
                    op == OpEnum.above ? i.UserId > int.Parse(queryParams.Search) :
                    op == OpEnum.below ? i.UserId < int.Parse(queryParams.Search) :
                    op == OpEnum.equal ? i.UserId == int.Parse(queryParams.Search) :
                    op == OpEnum.notequal ? i.UserId != int.Parse(queryParams.Search) :
                    i.UserId == int.Parse(queryParams.Search)),
                    _ => query.Where(i =>
                    op == OpEnum.aboveorequal ? i.PostId >= int.Parse(queryParams.Search) :
                    op == OpEnum.beloworequal ? i.PostId <= int.Parse(queryParams.Search) :
                    op == OpEnum.above ? i.PostId > int.Parse(queryParams.Search) :
                    op == OpEnum.below ? i.PostId < int.Parse(queryParams.Search) :
                    op == OpEnum.equal ? i.PostId == int.Parse(queryParams.Search) :
                    op == OpEnum.notequal ? i.PostId != int.Parse(queryParams.Search) :
                    i.PostId == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<Post> GetSortByData(IQueryable<Post> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "postfeat" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.IsFeatured) : query.OrderBy(i => i.IsFeatured),
                "title" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Title) : query.OrderBy(i => i.Title),
                "userId" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.UserId) : query.OrderBy(i => i.UserId),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.PostId) : query.OrderBy(i => i.PostId),
            };
        }

        return query;
    }

    private static IQueryable<Post> GetPaginationData(IQueryable<Post> query, QueryParams queryParams)
    {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}