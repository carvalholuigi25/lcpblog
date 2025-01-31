using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private ITagsRepo _tagsRepo;

        public TagsController(ITagsRepo tagsRepo)
        {
            _tagsRepo = tagsRepo;
        }

        /// <summary>
        /// Gets all tags.
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns>Gets all tags</returns>
        /// <response code="201">Returns the all categoreies</response>
        /// <response code="400">If the tags are empty</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<Tag>>> GetTags([FromQuery] QueryParams queryParams)
        {
            return await _tagsRepo.GetTags(queryParams);
        }

        /// <summary>
        /// Gets all tags by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Gets all tags by id</returns>
        /// <response code="201">Returns the all tags by id</response>
        /// <response code="400">If the tag is empty</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<Tag>> GetTag(int id)
        {
            return await _tagsRepo.GetTag(id);
        }

        /// <summary>
        /// Updates the tag by id and body.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Tag"></param>
        /// <returns>Updates the tag by id and body</returns>
        /// <response code="201">Returns the all updated tags by id</response>
        /// <response code="400">If the updated tag is empty</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTag(int id, Tag Tag)
        {
            return await _tagsRepo.PutTag(id, Tag);
        }

        /// <summary>
        /// Creates the tag by body.
        /// </summary>
        /// <param name="Tag"></param>
        /// <returns>Creates the tag by body</returns>
        /// <response code="201">Returns the new created tag</response>
        /// <response code="400">If the new created tag is empty</response>
        [HttpPost]
        public async Task<ActionResult<Tag>> CreateTag(Tag Tag)
        {
            return await _tagsRepo.CreateTag(Tag);
        }

        /// <summary>
        /// Deletes the tag by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Deletes the tag by id</returns>
        /// <response code="201">Returns the deleted tag</response>
        /// <response code="400">If the deleted tag is empty</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            return await _tagsRepo.DeleteTag(id);
        }
    }
}
