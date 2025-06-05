using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;
using lcpblogapi.Authorization;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginStatusController : ControllerBase
    {
        private ILoginStatusRepo _LoginStatusRepo;

        public LoginStatusController(ILoginStatusRepo LoginStatusRepo)
        {
            _LoginStatusRepo = LoginStatusRepo;
        }

        /// <summary>
        /// Gets all login status info.
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns>Gets all login status info</returns>
        /// <response code="201">Returns the all login status info</response>
        /// <response code="400">If the login status info are empty</response>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<LoginStatus>>> GetLoginStatus([FromQuery] QueryParams queryParams)
        {
            return await _LoginStatusRepo.GetLoginStatus(queryParams);
        }

        /// <summary>
        /// Gets all login status info by id.
        /// </summary>
        /// <param name="loginStatusId"></param>
        /// <returns>Gets all login status info by id</returns>
        /// <response code="201">Returns the login status info by id</response>
        /// <response code="400">If the login status info is empty</response>
        [HttpGet("{loginStatusId}")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginStatus>> GetLoginStatusById(int loginStatusId)
        {
            return await _LoginStatusRepo.GetLoginStatusById(loginStatusId);
        }
        
        /// <summary>
        /// Gets all login status id by user id.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Gets all login status id by user id</returns>
        /// <response code="201">Returns the all login status id by user id</response>
        /// <response code="400">If the login status id doesnt fetch by user id</response>
        [HttpGet("users/{userId}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LoginStatus>> GetLoginStatusIdByUserId(int userId = 1)
        {
            return await _LoginStatusRepo.GetLoginStatusIdByUser(userId);
        }

        /// <summary>
        /// Updates the login status info by id and body.
        /// </summary>
        /// <param name="loginStatusId"></param>
        /// <param name="loginStatus"></param>
        /// <returns>Updates the login status info by id and body</returns>
        /// <response code="201">Returns the all updated login status info by id</response>
        /// <response code="400">If the updated login status info is empty</response>
        [HttpPut("{loginStatusId}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutLoginStatus(int loginStatusId, LoginStatus loginStatus)
        {
            return await _LoginStatusRepo.PutLoginStatus(loginStatusId, loginStatus);
        }

        /// <summary>
        /// Creates the login status info by body.
        /// </summary>
        /// <param name="loginStatus"></param>
        /// <returns>Creates the login status info by body</returns>
        /// <response code="201">Returns the new created login status info </response>
        /// <response code="400">If the new created login status info is empty</response>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<LoginStatus>> CreateLoginStatus(LoginStatus loginStatus)
        {
            return await _LoginStatusRepo.PostLoginStatus(loginStatus);
        }

        /// <summary>
        /// Deletes the login status info by id.
        /// </summary>
        /// <param name="loginStatusId"></param>
        /// <returns>Deletes the login status info by id</returns>
        /// <response code="201">Returns the deleted login status info</response>
        /// <response code="400">If the deleted login status info is empty</response>
        [HttpDelete("{loginStatusId}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteLoginStatus(int loginStatusId)
        {
            return await _LoginStatusRepo.DeleteLoginStatus(loginStatusId);
        }
    }
}
