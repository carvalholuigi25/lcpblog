using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface ILoginStatusRepo {
    Task<ActionResult<IEnumerable<LoginStatus>>> GetLoginStatus(QueryParams queryParams);  
    Task<ActionResult<LoginStatus>> GetLoginStatusById(int? loginStatusId);
    Task<ActionResult<LoginStatus>> GetLoginStatusIdByUser(int? userId);
    Task<ActionResult<LoginStatus>> PostLoginStatus(LoginStatus loginStatus);
    Task<IActionResult> PutLoginStatus(int loginStatusId, LoginStatus loginStatus);
    Task<IActionResult> DeleteLoginStatus(int? loginStatusId);
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}