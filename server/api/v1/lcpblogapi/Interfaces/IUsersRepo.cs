using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface IUsersRepo {
    Task<ActionResult<IEnumerable<User>>> GetUsers(QueryParams queryParams);  
    Task<ActionResult<User>> GetUser(int? id); 
    Task<ActionResult<UserAvatarSearchResp>> GetAvatarUser(UserAvatarSearch uavatarsrch);
    Task<ActionResult<User>> PostUser(User user);
    Task<IActionResult> PutUser(int? id, User user);
    Task<IActionResult> DeleteUser(int? id);
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}