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

public class LoginAttemptsRepo : ControllerBase, ILoginAttemptsRepo
{
    private readonly MyDBContext _context;
    private readonly IHubContext<DataHub> _hub;

    private MyDBSQLFunctions _myDBSQLFunctions;

    public LoginAttemptsRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions, IHubContext<DataHub> hub)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
        _hub = hub;
    }

    public async Task<ActionResult<IEnumerable<LoginAttempts>>> GetLoginAttempts(QueryParams queryParams)
    {
        var query = _context.LoginAttempts.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<LoginAttempts>
        {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<LoginAttempts>> GetLoginAttempt(int? id)
    {
        var LoginAttempt = await _context.LoginAttempts.FindAsync(id);

        if (LoginAttempt == null)
        {
            return NotFound();
        }

        return LoginAttempt;
    }

    public async Task<ActionResult<LoginAttempts>> GetLoginAttemptIdByUser(int? userId)
    {
        var lattemptdata = await _context.LoginAttempts.Where(x => x.UserId == userId).Select(x => x.LoginAttemptId).FirstOrDefaultAsync();

        if (lattemptdata == -1)
        {
            return NotFound();
        }

        return Ok(lattemptdata);
    }

    public async Task<ActionResult<LoginAttempts>> PostLoginAttempts(LoginAttempts loginAttempt)
    {
        _context.LoginAttempts.Add(loginAttempt);
        await _context.SaveChangesAsync();
        await _hub.Clients.All.SendAsync("ReceiveMessage", loginAttempt);

        return CreatedAtAction(nameof(GetLoginAttempt), new { id = loginAttempt.LoginAttemptId }, loginAttempt);
    }

    public async Task<IActionResult> PutLoginAttempts(int loginAttemptId, LoginAttempts loginAttempt)
    {
        if (loginAttemptId != loginAttempt.LoginAttemptId)
        {
            return BadRequest();
        }

        _context.Entry(loginAttempt).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await _hub.Clients.All.SendAsync("ReceiveMessage", loginAttempt);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!LoginAttemptExists(loginAttemptId))
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

    public async Task<IActionResult> DeleteLoginAttempts(int? loginAttemptId)
    {
        var LoginAttempt = await _context.LoginAttempts.FindAsync(loginAttemptId);

        if (LoginAttempt == null)
        {
            return NotFound();
        }

        _context.LoginAttempts.Remove(LoginAttempt);
        await _myDBSQLFunctions.ResetAIID("LoginAttempts", 0);
        await _context.SaveChangesAsync();
        await _hub.Clients.All.SendAsync("ReceiveMessage", LoginAttempt);

        return NoContent();
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.LoginAttempts.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool LoginAttemptExists(int? id)
    {
        return _context.LoginAttempts.Any(e => e.LoginAttemptId == id);
    }

    private static IQueryable<LoginAttempts> GetFilterData(IQueryable<LoginAttempts> query, QueryParams queryParams)
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
                    "id" or "loginAttemptId" => query.Where(i =>
                    op == OpEnum.aboveorequal ? i.LoginAttemptId >= int.Parse(queryParams.Search) :
                    op == OpEnum.beloworequal ? i.LoginAttemptId <= int.Parse(queryParams.Search) :
                    op == OpEnum.above ? i.LoginAttemptId > int.Parse(queryParams.Search) :
                    op == OpEnum.below ? i.LoginAttemptId < int.Parse(queryParams.Search) :
                    op == OpEnum.equal ? i.LoginAttemptId == int.Parse(queryParams.Search) :
                    op == OpEnum.notequal ? i.LoginAttemptId != int.Parse(queryParams.Search) :
                    i.LoginAttemptId == int.Parse(queryParams.Search)),
                    _ => query.Where(i =>
                    op == OpEnum.aboveorequal ? i.LoginAttemptId >= int.Parse(queryParams.Search) :
                    op == OpEnum.beloworequal ? i.LoginAttemptId <= int.Parse(queryParams.Search) :
                    op == OpEnum.above ? i.LoginAttemptId > int.Parse(queryParams.Search) :
                    op == OpEnum.below ? i.LoginAttemptId < int.Parse(queryParams.Search) :
                    op == OpEnum.equal ? i.LoginAttemptId == int.Parse(queryParams.Search) :
                    op == OpEnum.notequal ? i.LoginAttemptId != int.Parse(queryParams.Search) :
                    i.LoginAttemptId == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<LoginAttempts> GetSortByData(IQueryable<LoginAttempts> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "attempts" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Attempts) : query.OrderBy(i => i.Attempts),
                "id" or "loginAttemptId" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.LoginAttemptId) : query.OrderBy(i => i.LoginAttemptId),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.LoginAttemptId) : query.OrderBy(i => i.LoginAttemptId),
            };
        }

        return query;
    }

    private static IQueryable<LoginAttempts> GetPaginationData(IQueryable<LoginAttempts> query, QueryParams queryParams)
    {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}