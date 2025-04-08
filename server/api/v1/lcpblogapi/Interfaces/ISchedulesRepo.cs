using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface ISchedulesRepo {
    Task<ActionResult<IEnumerable<Schedules>>> GetSchedules(QueryParams queryParams);  
    Task<ActionResult<Schedules>> GetSchedules(int? id); 
    Task<ActionResult<Schedules>> CreateSchedules(Schedules Schedules);
    Task<IActionResult> PutSchedules(int? id, Schedules Schedules);
    Task<IActionResult> DeleteSchedules(int? id);
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}