using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;
using lcpblogapi.Authorization;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediasController : ControllerBase
    {
        private IMediasRepo _MediasRepo;

        public MediasController(IMediasRepo MediasRepo)
        {
            _MediasRepo = MediasRepo;
        }

        /// <summary>
        /// Gets all medias.
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns>Gets all medias</returns>
        /// <response code="201">Returns the all medias</response>
        /// <response code="400">If the medias are empty</response>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<Media>>> GetAllMedias([FromQuery] QueryParams queryParams)
        {
            return await _MediasRepo.GetAllMedias(queryParams);
        }

        /// <summary>
        /// Gets all medias by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Gets all medias by id</returns>
        /// <response code="201">Returns the all medias by id</response>
        /// <response code="400">If the media is empty</response>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Media>> GetMedia(int id)
        {
            return await _MediasRepo.GetMedia(id);
        }

        /// <summary>
        /// Updates the media by id and body.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="media"></param>
        /// <returns>Updates the media by id and body</returns>
        /// <response code="201">Returns the all updated medias by id</response>
        /// <response code="400">If the updated media is empty</response>
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutMedia(int id, Media media)
        {
            return await _MediasRepo.PutMedia(id, media);
        }

        /// <summary>
        /// Creates the media by body.
        /// </summary>
        /// <param name="media"></param>
        /// <returns>Creates the media by body</returns>
        /// <response code="201">Returns the new created media</response>
        /// <response code="400">If the new created media is empty</response>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Media>> CreateMedia(Media media)
        {
            return await _MediasRepo.CreateMedia(media);
        }

        /// <summary>
        /// Deletes the media by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Deletes the media by id</returns>
        /// <response code="201">Returns the deleted media</response>
        /// <response code="400">If the deleted media is empty</response>
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteMedia(int id)
        {
            return await _MediasRepo.DeleteMedia(id);
        }

        /// <summary>
        /// Gets all medias by user id.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns>Gets all users medias by user id</returns>
        /// <response code="201">Returns the all medias by user id</response>
        /// <response code="400">If the medias by user id are empty</response>
        [HttpGet("users/{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Media>>> GetAllMediasByUserId(int userId, int page = 1, int pageSize = 10)
        {
            return await _MediasRepo.GetAllMediasByUserId(userId, page, pageSize);
        }
    }
}
