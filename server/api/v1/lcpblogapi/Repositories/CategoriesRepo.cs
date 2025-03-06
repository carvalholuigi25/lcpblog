using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lcpblogapi.Context;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;

namespace lcpblogapi.Repositories;

public class CategoriesRepo : ControllerBase, ICategoriesRepo
{
    private readonly MyDBContext _context;
private MyDBSQLFunctions _myDBSQLFunctions;

    public CategoriesRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
    }

    public async Task<ActionResult<IEnumerable<Category>>> GetCategories(QueryParams queryParams)
    {
        var query = _context.Categories.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<Category> {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<Category>> GetCategory(int? id)
    {
        var Category = await _context.Categories.FindAsync(id);

        if (Category == null)
        {
            return NotFound();
        }

        return Category;
    }

    public async Task<ActionResult<Category>> CreateCategory(Category Category)
    {
        _context.Categories.Add(Category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategory), new { id = Category.CategoryId }, Category);
    }

    public async Task<IActionResult> PutCategory(int? id, Category Category)
    {
        if (id != Category.CategoryId)
        {
            return BadRequest();
        }

        _context.Entry(Category).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CategoryExists(id))
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

    public async Task<IActionResult> DeleteCategory(int? id)
    {
        var Category = await _context.Categories.FindAsync(id);
        if (Category == null)
        {
            return NotFound();
        }

        _context.Categories.Remove(Category);
        await _myDBSQLFunctions.ResetAIID("categories", 0);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.Categories.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool CategoryExists(int? id)
    {
        return _context.Categories.Any(e => e.CategoryId == id);
    }

    private static IQueryable<Category> GetFilterData(IQueryable<Category> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.SortBy))
            {
                query = queryParams.SortBy.ToLower() switch
                {
                    "title" => query.Where(i => i.Name!.Contains(queryParams.Search)),
                    _ => query.Where(i => i.CategoryId == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<Category> GetSortByData(IQueryable<Category> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "title" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Name) : query.OrderBy(i => i.Name),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.CategoryId) : query.OrderBy(i => i.CategoryId),
            };
        }

        return query;
    }

    private static IQueryable<Category> GetPaginationData(IQueryable<Category> query, QueryParams queryParams)
    {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}