using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lcpblogapi.Context;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;

namespace lcpblogapi.Repositories;

public class CommentsRepo : ControllerBase, ICommentsRepo
{
    private readonly MyDBContext _context;
    private MyDBSQLFunctions _myDBSQLFunctions;

    public CommentsRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
    }

    public async Task<ActionResult<IEnumerable<Comment>>> GetComments(QueryParams queryParams)
    {
        var query = _context.Comments.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<Comment>
        {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<Comment>> GetComment(int? id)
    {
        var Comment = await _context.Comments.FindAsync(id);

        if (Comment == null)
        {
            return NotFound();
        }

        return Comment;
    }

    public async Task<ActionResult<IEnumerable<Comment>>> GetCommentByPost(int? postId)
    {
        var Comment = await _context.Comments.Where(x => x.PostId == postId).ToListAsync();

        if (Comment == null)
        {
            return NotFound();
        }

        return Comment;
    }

    public async Task<ActionResult<Comment>> CreateComment(Comment Comment)
    {
        _context.Comments.Add(Comment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetComment), new { id = Comment.CommentId }, Comment);
    }

    public async Task<IActionResult> PutComment(int? id, Comment Comment)
    {
        if (id != Comment.CommentId)
        {
            return BadRequest();
        }

        _context.Entry(Comment).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CommentExists(id))
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

    public async Task<IActionResult> DeleteComment(int? id)
    {
        var Comment = await _context.Comments.FindAsync(id);
        if (Comment == null)
        {
            return NotFound();
        }

        _context.Comments.Remove(Comment);
        await _myDBSQLFunctions.ResetAIID("comments", 0);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.Comments.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool CommentExists(int? id)
    {
        return _context.Comments.Any(e => e.CommentId == id);
    }

    private static IQueryable<Comment> GetFilterData(IQueryable<Comment> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.SortBy))
            {
                query = queryParams.SortBy.ToLower() switch
                {
                    "content" => query.Where(i => i.Content!.Contains(queryParams.Search)),
                    _ => query.Where(i => i.CommentId == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<Comment> GetSortByData(IQueryable<Comment> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "content" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Content) : query.OrderBy(i => i.Content),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.CommentId) : query.OrderBy(i => i.CommentId),
            };
        }

        return query;
    }

    private static IQueryable<Comment> GetPaginationData(IQueryable<Comment> query, QueryParams queryParams)
    {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}