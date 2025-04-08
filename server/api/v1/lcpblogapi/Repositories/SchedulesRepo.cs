using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lcpblogapi.Context;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;

namespace lcpblogapi.Repositories;

public class SchedulesRepo : ControllerBase, ISchedulesRepo
{
    private readonly MyDBContext _context;
    private MyDBSQLFunctions _myDBSQLFunctions;

    public SchedulesRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
    }

    public async Task<ActionResult<IEnumerable<Schedules>>> GetSchedules(QueryParams queryParams)
    {
        var query = _context.Schedule.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<Schedules>
        {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<Schedules>> GetSchedules(int? id)
    {
        var Schedule = await _context.Schedule.FindAsync(id);

        if (Schedule == null)
        {
            return NotFound();
        }

        return Schedule;
    }

    public async Task<ActionResult<Schedules>> CreateSchedules(Schedules Schedule)
    {
        if (string.IsNullOrEmpty(Schedule.Title))
        {
            return BadRequest("Schedule name cannot be empty.");
        }

        if (_context.Schedule.Any(e => e.Title == Schedule.Title))
        {
            return Conflict("Schedule already exists.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Schedule.Add(Schedule);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSchedules), new { id = Schedule.ScheduleId }, Schedule);
    }

    public async Task<IActionResult> PutSchedules(int? id, Schedules Schedule)
    {
        if (string.IsNullOrEmpty(Schedule.Title))
        {
            return BadRequest("Schedule title cannot be empty.");
        }

        if (_context.Schedule.Any(e => e.Title == Schedule.Title))
        {
            return Conflict("Schedule already exists.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != Schedule.ScheduleId)
        {
            return BadRequest();
        }

        _context.Entry(Schedule).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SchedulesExists(id))
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

    public async Task<IActionResult> DeleteSchedules(int? id)
    {
        var Schedule = await _context.Schedule.FindAsync(id);
        if (Schedule == null)
        {
            return NotFound();
        }

        _context.Schedule.Remove(Schedule);
        await _myDBSQLFunctions.ResetAIID("schedules", 0);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.Schedule.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool SchedulesExists(int? id)
    {
        return _context.Schedule.Any(e => e.ScheduleId == id);
    }

    private static IQueryable<Schedules> GetFilterData(IQueryable<Schedules> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.SortBy))
            {
                query = queryParams.SortBy.ToLower() switch
                {
                    "title" => query.Where(i => i.Title!.Contains(queryParams.Search)),
                    "dateStart" => query.Where(i => i.DateStart! == Convert.ToDateTime(queryParams.Search.ToString())),
                    "dateEnd" => query.Where(i => i.DateEnd! == Convert.ToDateTime(queryParams.Search.ToString())),
                    "allDay" => query.Where(i => i.AllDay! == Convert.ToBoolean(queryParams.Search.ToString())),
                    _ => query.Where(i => i.ScheduleId == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<Schedules> GetSortByData(IQueryable<Schedules> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "title" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Title) : query.OrderBy(i => i.Title),
                "dateStart" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.DateStart) : query.OrderBy(i => i.DateStart),
                "dateEnd" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.DateEnd) : query.OrderBy(i => i.DateEnd),
                "allDay" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.AllDay) : query.OrderBy(i => i.AllDay),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.ScheduleId) : query.OrderBy(i => i.ScheduleId),
            };
        }

        return query;
    }

    private static IQueryable<Schedules> GetPaginationData(IQueryable<Schedules> query, QueryParams queryParams)
    {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}