using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Authorization;
using lcpblogapi.Models.QParams;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepo _usersRepo;

        public UsersController(IUsersRepo usersRepo)
        {
            _usersRepo = usersRepo;
        }

        /// <summary>
        /// Gets all users infos.
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns>Gets all users infos</returns>
        /// <response code="201">Returns the all infos about users</response>
        /// <response code="400">If the users infos are empty</response>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers([FromQuery] QueryParams queryParams)
        {
            return await _usersRepo.GetUsers(queryParams);
        }

        /// <summary>
        /// Gets user info by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Gets user info by id</returns>
        /// <response code="201">Returns the info about user</response>
        /// <response code="400">If the user info is empty</response>
        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<User>> GetUser(int? id)
        {
            return await _usersRepo.GetUser(id);
        }

        /// <summary>
        /// Gets user avatar by email.
        /// </summary>
        /// <param name="uavatarsrch"></param>
        /// <returns>Gets user avatar by email</returns>
        /// <response code="201">Returns the user's avatar</response>
        /// <response code="400">If the user's avatar is empty</response>
        [HttpGet("avatar")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserAvatarSearchResp>> GetUserAvatar([FromQuery] UserAvatarSearch uavatarsrch)
        {
            return await _usersRepo.GetAvatarUser(uavatarsrch);
        }

        /// <summary>
        /// Creates a user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns>A newly created user</returns>
        /// <response code="201">Returns the newly created user info</response>
        /// <response code="400">If the user info is empty</response>
        [HttpPost]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            return await _usersRepo.PostUser(user);
        }

        /// <summary>
        /// Updates specific user info by id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="user"></param>
        /// <returns>Updates specific user info by id</returns>
        /// <response code="201">Returns the all users infos updated by id and its body</response>
        /// <response code="400">If the users infos updated are empty by id and its body</response>
        [HttpPut("{id}")]
        [Authorize(Policy = "StaffOnly")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            return await _usersRepo.PutUser(id, user);
        }

        /// <summary>
        /// Deletes specific user info by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Deletes the specific user info by id</returns>
        /// <response code="201">Returns the all users infos are deleted by id</response>
        /// <response code="400">If the users infos are deleted by id</response>
        [HttpDelete("{id}")]
        [Authorize(Policy = "StaffOnly")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteUser(int? id)
        {
            return await _usersRepo.DeleteUser(id);
        }
        
        /// <summary>
        /// Gets user post(s) by user id.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Gets user post(s) by user id</returns>
        /// <response code="201">Returns the post about user</response>
        /// <response code="400">If the post is empty</response>
        [HttpGet("posts/{userId}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<Post>>> GetPostsByUserId(int? userId)
        {
            return await _usersRepo.GetUsersPostsByUserId(userId);
        }
    }
}
