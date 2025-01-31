using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private ICommentsRepo _commentsRepo;

        public CommentsController(ICommentsRepo commentsRepo)
        {
            _commentsRepo = commentsRepo;
        }

        /// <summary>
        /// Gets all comments.
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns>Gets all comments</returns>
        /// <response code="201">Returns the all categoreies</response>
        /// <response code="400">If the comments are empty</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments([FromQuery] QueryParams queryParams)
        {
            return await _commentsRepo.GetComments(queryParams);
        }

        /// <summary>
        /// Gets all comments by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Gets all comments by id</returns>
        /// <response code="201">Returns the all comments by id</response>
        /// <response code="400">If the comment is empty</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            return await _commentsRepo.GetComment(id);
        }

        /// <summary>
        /// Updates the comment by id and body.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Comment"></param>
        /// <returns>Updates the comment by id and body</returns>
        /// <response code="201">Returns the all updated comments by id</response>
        /// <response code="400">If the updated comment is empty</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(int id, Comment Comment)
        {
            return await _commentsRepo.PutComment(id, Comment);
        }

        /// <summary>
        /// Creates the comment by body.
        /// </summary>
        /// <param name="Comment"></param>
        /// <returns>Creates the comment by body</returns>
        /// <response code="201">Returns the new created comment</response>
        /// <response code="400">If the new created comment is empty</response>
        [HttpPost]
        public async Task<ActionResult<Comment>> CreateComment(Comment Comment)
        {
            return await _commentsRepo.CreateComment(Comment);
        }

        /// <summary>
        /// Deletes the comment by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Deletes the comment by id</returns>
        /// <response code="201">Returns the deleted comment</response>
        /// <response code="400">If the deleted comment is empty</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            return await _commentsRepo.DeleteComment(id);
        }
    }
}
