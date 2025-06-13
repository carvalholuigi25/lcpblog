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

public class MediasRepo : ControllerBase, IMediasRepo
{
    private readonly MyDBContext _context;
    private readonly IHubContext<DataHub> _hub;

    private MyDBSQLFunctions _myDBSQLFunctions;

    public MediasRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions, IHubContext<DataHub> hub)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
        _hub = hub;
    }

    public async Task<ActionResult<IEnumerable<Media>>> GetAllMedias(QueryParams queryParams)
    {
        var query = _context.Medias.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<Media>
        {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<Media>> GetMedia(int? id)
    {
        var Media = await _context.Medias.FindAsync(id);

        if (Media == null)
        {
            return NotFound();
        }

        return Media;
    }

    public async Task<ActionResult<Media>> CreateMedia(Media media)
    {
        if (!string.IsNullOrEmpty(media.Src) && !string.IsNullOrEmpty(media.Title))
        {
            if (_context.Medias.Where(x => x.Src!.ToLower().Equals(media.Src!.ToLower()) || x.Title!.ToLower().Equals(media.Title!.ToLower())).Count() == 1)
            {
                return BadRequest("This media already exists in our database!");
            }   
        }

        _context.Medias.Add(media);
        await _context.SaveChangesAsync();
        await _hub.Clients.All.SendAsync("ReceiveMessage", media);

        return CreatedAtAction(nameof(GetMedia), new { id = media.MediaId }, media);
    }

    public async Task<IActionResult> PutMedia(int? id, Media media)
    {
        if (id != media.MediaId)
        {
            return BadRequest();
        }

        if (!string.IsNullOrEmpty(media.Src) && !string.IsNullOrEmpty(media.Title))
        {
            if (_context.Medias.Where(x => x.Src!.ToLower().Equals(media.Src!.ToLower()) || x.Title!.ToLower().Equals(media.Title!.ToLower())).Count() == 0)
            {
                return BadRequest("This media does not exist in our database!");
            }   
        }

        _context.Entry(media).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveMessage", media);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MediaExists(id))
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

    public async Task<IActionResult> DeleteMedia(int? id)
    {
        var Media = await _context.Medias.FindAsync(id);

        if (Media == null)
        {
            return NotFound();
        }

        _context.Medias.Remove(Media);
        await _myDBSQLFunctions.ResetAIID("Medias", 0);
        await _context.SaveChangesAsync();
        await _hub.Clients.All.SendAsync("ReceiveMessage", Media);

        return NoContent();
    }

    public async Task<ActionResult<IEnumerable<Media>>> GetAllMediasByUserId(int userId, int page = 1, int pageSize = 10)
    {
        // var Media = await _context.Medias.Where(p => p.UserId == userId && p.MediaId >= 1).ToListAsync();

        // if (Media == null)
        // {
        //     return NotFound();
        // }

        // return Media;

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

        var query = _context.Medias.AsQueryable();

        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<Media>
        {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.Medias.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool MediaExists(int? id)
    {
        return _context.Medias.Any(e => e.MediaId == id);
    }

    private static IQueryable<Media> GetFilterData(IQueryable<Media> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.FieldName))
            {
                var op = queryParams.Op!.Value;

                query = queryParams.FieldName switch
                {
                    "src" => query.Where(i =>
                    op == OpEnum.contains ? i.Src!.ToLower().Contains(queryParams.Search.ToLower()) :
                    op == OpEnum.notcontains ? !i.Src!.ToLower().Contains(queryParams.Search.ToLower()) :
                    op == OpEnum.equal ? i.Src!.ToLower().Equals(queryParams.Search.ToLower()) :
                    op == OpEnum.notequal ? !i.Src!.ToLower().Equals(queryParams.Search.ToLower()) :
                    op == OpEnum.startswith ? i.Src!.ToLower().StartsWith(queryParams.Search.ToLower()) :
                    op == OpEnum.endswith ? i.Src!.ToLower().EndsWith(queryParams.Search.ToLower()) :
                    i.Src!.ToLower() == queryParams.Search.ToLower()),
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
                    op == OpEnum.aboveorequal ? i.MediaId >= int.Parse(queryParams.Search) :
                    op == OpEnum.beloworequal ? i.MediaId <= int.Parse(queryParams.Search) :
                    op == OpEnum.above ? i.MediaId > int.Parse(queryParams.Search) :
                    op == OpEnum.below ? i.MediaId < int.Parse(queryParams.Search) :
                    op == OpEnum.equal ? i.MediaId == int.Parse(queryParams.Search) :
                    op == OpEnum.notequal ? i.MediaId != int.Parse(queryParams.Search) :
                    i.MediaId == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<Media> GetSortByData(IQueryable<Media> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "src" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Src) : query.OrderBy(i => i.Src),
                "title" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Title) : query.OrderBy(i => i.Title),
                "userId" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.UserId) : query.OrderBy(i => i.UserId),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.MediaId) : query.OrderBy(i => i.MediaId),
            };
        }

        return query;
    }

    private static IQueryable<Media> GetPaginationData(IQueryable<Media> query, QueryParams queryParams)
    {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}