using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;
using lcpblogapi.Authorization;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginAttemptsController : ControllerBase
    {
        private ILoginAttemptsRepo _LoginAttemptsRepo;

        public LoginAttemptsController(ILoginAttemptsRepo LoginAttemptsRepo)
        {
            _LoginAttemptsRepo = LoginAttemptsRepo;
        }

        /// <summary>
        /// Gets all login attempts info.
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns>Gets all login attempts info</returns>
        /// <response code="201">Returns the all login attempts info</response>
        /// <response code="400">If the login attempts info are empty</response>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<LoginAttempts>>> GetLoginAttempts([FromQuery] QueryParams queryParams)
        {
            return await _LoginAttemptsRepo.GetLoginAttempts(queryParams);
        }

        /// <summary>
        /// Gets all login attempts info by id.
        /// </summary>
        /// <param name="loginAttemptId"></param>
        /// <returns>Gets all login attempts info by id</returns>
        /// <response code="201">Returns the login attempts info by id</response>
        /// <response code="400">If the login attempts info is empty</response>
        [HttpGet("{loginAttemptId}")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginAttempts>> GetLoginAttempt(int loginAttemptId)
        {
            return await _LoginAttemptsRepo.GetLoginAttempt(loginAttemptId);
        }
        
        /// <summary>
        /// Gets all login attempt id by user id.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Gets all login attempt id by user id</returns>
        /// <response code="201">Returns the all login attempts id by user id</response>
        /// <response code="400">If the login attempts id doesnt fetch by user id</response>
        [HttpGet("users/{userId}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LoginAttempts>> GetLoginAttemptIdByUserId(int userId = 1)
        {
            return await _LoginAttemptsRepo.GetLoginAttemptIdByUser(userId);
        }

        /// <summary>
        /// Updates the login attempts info by id and body.
        /// </summary>
        /// <param name="loginAttemptId"></param>
        /// <param name="loginAttempt"></param>
        /// <returns>Updates the login attempts info by id and body</returns>
        /// <response code="201">Returns the all updated login attempts info by id</response>
        /// <response code="400">If the updated login attempts info is empty</response>
        [HttpPut("{loginAttemptId}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutLoginAttempts(int loginAttemptId, LoginAttempts loginAttempt)
        {
            return await _LoginAttemptsRepo.PutLoginAttempts(loginAttemptId, loginAttempt);
        }

        /// <summary>
        /// Creates the login attempts info by body.
        /// </summary>
        /// <param name="LoginAttempt"></param>
        /// <returns>Creates the login attempts info by body</returns>
        /// <response code="201">Returns the new created login attempts info </response>
        /// <response code="400">If the new created login attempts info is empty</response>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<LoginAttempts>> CreateLoginAttempt(LoginAttempts LoginAttempt)
        {
            return await _LoginAttemptsRepo.PostLoginAttempts(LoginAttempt);
        }

        /// <summary>
        /// Deletes the login attempts info by id.
        /// </summary>
        /// <param name="loginAttemptId"></param>
        /// <returns>Deletes the login attempts info by id</returns>
        /// <response code="201">Returns the deleted login attempts info</response>
        /// <response code="400">If the deleted login attempts info is empty</response>
        [HttpDelete("{loginAttemptId}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteLoginAttempt(int loginAttemptId)
        {
            return await _LoginAttemptsRepo.DeleteLoginAttempts(loginAttemptId);
        }
    }
}
