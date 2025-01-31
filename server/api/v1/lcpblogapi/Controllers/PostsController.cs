using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;
using lcpblogapi.Authorization;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private IPostsRepo _postsRepo;

        public PostsController(IPostsRepo postsRepo)
        {
            _postsRepo = postsRepo;
        }

        /// <summary>
        /// Gets all posts.
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns>Gets all users posts</returns>
        /// <response code="201">Returns the all categoreies</response>
        /// <response code="400">If the posts are empty</response>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts([FromQuery] QueryParams queryParams)
        {
            return await _postsRepo.GetPosts(queryParams);
        }

        /// <summary>
        /// Gets all posts by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Gets all users posts by id</returns>
        /// <response code="201">Returns the all posts by id</response>
        /// <response code="400">If the post is empty</response>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            return await _postsRepo.GetPost(id);
        }

        /// <summary>
        /// Updates the post by id and body.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Post"></param>
        /// <returns>Updates the post by id and body</returns>
        /// <response code="201">Returns the all updated posts by id</response>
        /// <response code="400">If the updated post is empty</response>
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutPost(int id, Post Post)
        {
            return await _postsRepo.PutPost(id, Post);
        }

        /// <summary>
        /// Creates the post by body.
        /// </summary>
        /// <param name="Post"></param>
        /// <returns>Creates the post by body</returns>
        /// <response code="201">Returns the new created post</response>
        /// <response code="400">If the new created post is empty</response>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Post>> CreatePost(Post Post)
        {
            return await _postsRepo.CreatePost(Post);
        }

        /// <summary>
        /// Deletes the post by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Deletes the post by id</returns>
        /// <response code="201">Returns the deleted post</response>
        /// <response code="400">If the deleted post is empty</response>
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeletePost(int id)
        {
            return await _postsRepo.DeletePost(id);
        }
    }
}
