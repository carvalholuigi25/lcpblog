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

public class LoginStatusRepo : ControllerBase, ILoginStatusRepo
{
    private readonly MyDBContext _context;
    private readonly IHubContext<DataHub> _hub;

    private MyDBSQLFunctions _myDBSQLFunctions;

    public LoginStatusRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions, IHubContext<DataHub> hub)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
        _hub = hub;
    }

    public async Task<ActionResult<IEnumerable<LoginStatus>>> GetLoginStatus(QueryParams queryParams)
    {
        var query = _context.LoginStatus.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<LoginStatus>
        {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<LoginStatus>> GetLoginStatusById(int? id)
    {
        var loginStatus = await _context.LoginStatus.FindAsync(id);

        if (loginStatus == null)
        {
            return NotFound();
        }

        return loginStatus;
    }

    public async Task<ActionResult<LoginStatus>> GetLoginStatusIdByUser(int? userId)
    {
        var lstatsdata = await _context.LoginStatus.Where(x => x.UserId == userId).Select(x => x.LoginStatusId).FirstOrDefaultAsync();

        if (lstatsdata == -1)
        {
            return NotFound();
        }

        return Ok(lstatsdata);
    }

    public async Task<ActionResult<LoginStatus>> PostLoginStatus(LoginStatus loginStatus)
    {
        _context.LoginStatus.Add(loginStatus);
        await _context.SaveChangesAsync();
        await _hub.Clients.All.SendAsync("ReceiveMessage", loginStatus);

        return CreatedAtAction(nameof(GetLoginStatus), new { id = loginStatus.LoginStatusId }, loginStatus);
    }

    public async Task<IActionResult> PutLoginStatus(int loginStatusId, LoginStatus loginStatus)
    {
        if (loginStatusId != loginStatus.LoginStatusId)
        {
            return BadRequest();
        }

        _context.Entry(loginStatus).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveMessage", loginStatus);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!LoginStatExists(loginStatusId))
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

    public async Task<IActionResult> DeleteLoginStatus(int? loginStatusId)
    {
        var loginStatus = await _context.LoginStatus.FindAsync(loginStatusId);

        if (loginStatus == null)
        {
            return NotFound();
        }

        _context.LoginStatus.Remove(loginStatus);
        await _myDBSQLFunctions.ResetAIID("LoginStatus", 0);
        await _context.SaveChangesAsync();
        await _hub.Clients.All.SendAsync("ReceiveMessage", loginStatus);

        return NoContent();
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.LoginStatus.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool LoginStatExists(int? id)
    {
        return _context.LoginStatus.Any(e => e.LoginStatusId == id);
    }

    private static IQueryable<LoginStatus> GetFilterData(IQueryable<LoginStatus> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.FieldName))
            {
                var op = queryParams.Op!.Value;

                query = queryParams.FieldName switch
                {
                    "attempts" => query.Where(i =>
                    op == OpEnum.aboveorequal ? i.Attempts >= int.Parse(queryParams.Search) :
                    op == OpEnum.beloworequal ? i.Attempts <= int.Parse(queryParams.Search) :
                    op == OpEnum.above ? i.Attempts > int.Parse(queryParams.Search) :
                    op == OpEnum.below ? i.Attempts < int.Parse(queryParams.Search) :
                    op == OpEnum.equal ? i.Attempts == int.Parse(queryParams.Search) :
                    op == OpEnum.notequal ? i.Attempts != int.Parse(queryParams.Search) :
                    i.Attempts == int.Parse(queryParams.Search)), 
                    "id" or "loginStatusId" => query.Where(i =>
                    op == OpEnum.aboveorequal ? i.LoginStatusId >= int.Parse(queryParams.Search) :
                    op == OpEnum.beloworequal ? i.LoginStatusId <= int.Parse(queryParams.Search) :
                    op == OpEnum.above ? i.LoginStatusId > int.Parse(queryParams.Search) :
                    op == OpEnum.below ? i.LoginStatusId < int.Parse(queryParams.Search) :
                    op == OpEnum.equal ? i.LoginStatusId == int.Parse(queryParams.Search) :
                    op == OpEnum.notequal ? i.LoginStatusId != int.Parse(queryParams.Search) :
                    i.LoginStatusId == int.Parse(queryParams.Search)),
                    _ => query.Where(i =>
                    op == OpEnum.aboveorequal ? i.LoginStatusId >= int.Parse(queryParams.Search) :
                    op == OpEnum.beloworequal ? i.LoginStatusId <= int.Parse(queryParams.Search) :
                    op == OpEnum.above ? i.LoginStatusId > int.Parse(queryParams.Search) :
                    op == OpEnum.below ? i.LoginStatusId < int.Parse(queryParams.Search) :
                    op == OpEnum.equal ? i.LoginStatusId == int.Parse(queryParams.Search) :
                    op == OpEnum.notequal ? i.LoginStatusId != int.Parse(queryParams.Search) :
                    i.LoginStatusId == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<LoginStatus> GetSortByData(IQueryable<LoginStatus> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "attempts" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Attempts) : query.OrderBy(i => i.Attempts),
                "id" or "loginStatusId" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.LoginStatusId) : query.OrderBy(i => i.LoginStatusId),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.LoginStatusId) : query.OrderBy(i => i.LoginStatusId),
            };
        }

        return query;
    }

    private static IQueryable<LoginStatus> GetPaginationData(IQueryable<LoginStatus> query, QueryParams queryParams)
    {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}