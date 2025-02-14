using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lcpblogapi.Context;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;

namespace lcpblogapi.Repositories;

public class PostsRepo : ControllerBase, IPostsRepo
{
    private readonly MyDBContext _context;
    private MyDBSQLFunctions _myDBSQLFunctions;

    public PostsRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
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

        return NoContent();
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.Posts.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool PostExists(int? id)
    {
        return _context.Posts.Any(e => e.PostId == id);
    }

    private static IQueryable<Post> GetFilterData(IQueryable<Post> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.SortBy))
            {
                query = queryParams.SortBy.ToLower() switch
                {
                    "title" => query.Where(i => i.Title!.ToLower().Contains(queryParams.Search.ToLower())),
                    _ => query.Where(i => i.PostId == int.Parse(queryParams.Search)),
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
                "title" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Title) : query.OrderBy(i => i.Title),
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