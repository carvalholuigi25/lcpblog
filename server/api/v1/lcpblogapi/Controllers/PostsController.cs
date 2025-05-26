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

        /// <summary>
        /// Updates the post by view props.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="postViews"></param>
        /// <returns>Updates the post by view props</returns>
        /// <response code="201">Returns the updated view</response>
        /// <response code="400">If the updated view is empty</response>
        [HttpPut("views/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Post>> UpdateViewsPost(int id, PostViews postViews) 
        {
            return await _postsRepo.UpdateViewsPost(id, postViews);
        }

        /// <summary>
        /// Gets all posts by tag name.
        /// </summary>
        /// <param name="tagname"></param>
        /// <returns>Gets all users posts by tag name</returns>
        /// <response code="201">Returns the all posts by tag name</response>
        /// <response code="400">If the posts by tag name are empty</response>
        [HttpGet("tags/{tagname}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Post>>> GetPostsByTagName(string tagname = "#geral")
        {
            return await _postsRepo.GetPostsByTagName(tagname);
        }

        /// <summary>
        /// Get archive info.
        /// </summary>
        /// <returns>Get archive info</returns>
        /// <response code="201">Returns the all archive info</response>
        /// <response code="400">If the archive info is empty</response>
        [HttpGet("archive")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetArchivePost(int year = 2025)
        {
            return await _postsRepo.GetArchivePost(year);
        }

        /// <summary>
        /// Get dataset info for chart.
        /// </summary>
        /// <returns>Get dataset info for chart</returns>
        /// <response code="201">Returns the all dataset info</response>
        /// <response code="400">If the dataset info is empty</response>
        [HttpGet("dataset")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<IEnumerable<Dataset>> GetDatasetPost(int year = 2025, string? lang = "en")
        {
            return _postsRepo.GetDatasetPost(year, lang);
        }
    }
}
