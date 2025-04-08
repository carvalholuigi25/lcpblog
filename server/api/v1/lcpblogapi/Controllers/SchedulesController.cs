using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;
using lcpblogapi.Authorization;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private ISchedulesRepo _schedulesRepo;

        public SchedulesController(ISchedulesRepo schedulesRepo)
        {
            _schedulesRepo = schedulesRepo;
        }

        /// <summary>
        /// Gets all schedules.
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns>Gets all users schedules</returns>
        /// <response code="201">Returns the all categoreies</response>
        /// <response code="400">If the schedules are empty</response>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<Schedules>>> GetSchedules([FromQuery] QueryParams queryParams)
        {
            return await _schedulesRepo.GetSchedules(queryParams);
        }

        /// <summary>
        /// Gets all schedules by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Gets all users schedules by id</returns>
        /// <response code="201">Returns the all schedules by id</response>
        /// <response code="400">If the schedules is empty</response>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Schedules>> GetSchedules(int id)
        {
            return await _schedulesRepo.GetSchedules(id);
        }

        /// <summary>
        /// Updates the schedules by id and body.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="schedules"></param>
        /// <returns>Updates the schedules by id and body</returns>
        /// <response code="201">Returns the all updated schedules by id</response>
        /// <response code="400">If the updated schedules is empty</response>
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutSchedules(int id, Schedules schedules)
        {
            return await _schedulesRepo.PutSchedules(id, schedules);
        }

        /// <summary>
        /// Creates the schedules by body.
        /// </summary>
        /// <param name="schedules"></param>
        /// <returns>Creates the schedules by body</returns>
        /// <response code="201">Returns the new created schedules</response>
        /// <response code="400">If the new created schedules is empty</response>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Schedules>> CreateSchedules(Schedules schedules)
        {
            return await _schedulesRepo.CreateSchedules(schedules);
        }

        /// <summary>
        /// Deletes the schedules by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Deletes the schedules by id</returns>
        /// <response code="201">Returns the deleted schedules</response>
        /// <response code="400">If the deleted schedules is empty</response>
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteSchedules(int id)
        {
            return await _schedulesRepo.DeleteSchedules(id);
        }
    }
}
