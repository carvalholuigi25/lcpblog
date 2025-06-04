using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface ILoginAttemptsRepo {
    Task<ActionResult<IEnumerable<LoginAttempts>>> GetLoginAttempts(QueryParams queryParams);  
    Task<ActionResult<LoginAttempts>> GetLoginAttempt(int? loginAttemptId);
    Task<ActionResult<LoginAttempts>> GetLoginAttemptIdByUser(int? userId);
    Task<ActionResult<LoginAttempts>> PostLoginAttempts(LoginAttempts loginAttempt);
    Task<IActionResult> PutLoginAttempts(int loginAttemptId, LoginAttempts loginAttempt);
    Task<IActionResult> DeleteLoginAttempts(int? loginAttemptId);
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}