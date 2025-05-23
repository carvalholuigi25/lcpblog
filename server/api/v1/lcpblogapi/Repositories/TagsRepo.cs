using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lcpblogapi.Context;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;

namespace lcpblogapi.Repositories;

public class TagsRepo : ControllerBase, ITagsRepo
{
    private readonly MyDBContext _context;
private MyDBSQLFunctions _myDBSQLFunctions;

    public TagsRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
    }

    public async Task<ActionResult<IEnumerable<Tag>>> GetTags(QueryParams queryParams)
    {
        var query = _context.Tags.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<Tag>
        {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<Tag>> GetTag(int? id)
    {
        var Tag = await _context.Tags.FindAsync(id);

        if (Tag == null)
        {
            return NotFound();
        }

        return Tag;
    }

    public async Task<ActionResult<Tag>> CreateTag(Tag Tag)
    {
        if(string.IsNullOrEmpty(Tag.Name) || !Tag.Name.StartsWith('#'))
        {
            return BadRequest("Please write the name of tag with hashtag (#)");
        }

        if (_context.Tags.Where(x => x.Name!.ToLower().Equals(Tag.Name.ToLower())).Count() == 1)
        {
            return BadRequest("Tag already exists!");
        }

        _context.Tags.Add(Tag);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTag), new { id = Tag.TagId }, Tag);
    }

    public async Task<IActionResult> PutTag(int? id, Tag Tag)
    {
        if (id != Tag.TagId)
        {
            return BadRequest();
        }

        if(string.IsNullOrEmpty(Tag.Name) || !Tag.Name.StartsWith('#'))
        {
            return BadRequest("Please write the name of tag with hashtag (#)");
        }

        if (_context.Tags.Where(x => x.Name!.ToLower().Equals(Tag.Name.ToLower())).Count() == 1)
        {
            return BadRequest("Tag already exists!");
        }

        _context.Entry(Tag).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TagExists(id))
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

    public async Task<IActionResult> DeleteTag(int? id)
    {
        var Tag = await _context.Tags.FindAsync(id);
        if (Tag == null)
        {
            return NotFound();
        }

        _context.Tags.Remove(Tag);
        await _myDBSQLFunctions.ResetAIID("tags", 0);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.Tags.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool TagExists(int? id)
    {
        return _context.Tags.Any(e => e.TagId == id);
    }

    private static IQueryable<Tag> GetFilterData(IQueryable<Tag> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.SortBy))
            {
                query = queryParams.SortBy.ToLower() switch
                {
                    "name" => query.Where(i => i.Name!.Contains(queryParams.Search)),
                    _ => query.Where(i => i.TagId == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<Tag> GetSortByData(IQueryable<Tag> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "name" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Name) : query.OrderBy(i => i.Name),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.TagId) : query.OrderBy(i => i.TagId),
            };
        }

        return query;
    }

    private static IQueryable<Tag> GetPaginationData(IQueryable<Tag> query, QueryParams queryParams)
    {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}