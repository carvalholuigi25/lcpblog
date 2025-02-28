using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;
using lcpblogapi.Authorization;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private ICategoriesRepo _categoriesRepo;

        public CategoriesController(ICategoriesRepo categoriesRepo)
        {
            _categoriesRepo = categoriesRepo;
        }

        /// <summary>
        /// Gets all categories.
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns>Gets all users categories</returns>
        /// <response code="201">Returns the all categoreies</response>
        /// <response code="400">If the categories are empty</response>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories([FromQuery] QueryParams queryParams)
        {
            return await _categoriesRepo.GetCategories(queryParams);
        }

        /// <summary>
        /// Gets all categories by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Gets all users categories by id</returns>
        /// <response code="201">Returns the all categories by id</response>
        /// <response code="400">If the category is empty</response>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            return await _categoriesRepo.GetCategory(id);
        }

        /// <summary>
        /// Updates the category by id and body.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Category"></param>
        /// <returns>Updates the category by id and body</returns>
        /// <response code="201">Returns the all updated categories by id</response>
        /// <response code="400">If the updated category is empty</response>
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutCategory(int id, Category Category)
        {
            return await _categoriesRepo.PutCategory(id, Category);
        }

        /// <summary>
        /// Creates the category by body.
        /// </summary>
        /// <param name="Category"></param>
        /// <returns>Creates the category by body</returns>
        /// <response code="201">Returns the new created category</response>
        /// <response code="400">If the new created category is empty</response>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Category>> CreateCategory(Category Category)
        {
            return await _categoriesRepo.CreateCategory(Category);
        }

        /// <summary>
        /// Deletes the category by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Deletes the category by id</returns>
        /// <response code="201">Returns the deleted category</response>
        /// <response code="400">If the deleted category is empty</response>
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            return await _categoriesRepo.DeleteCategory(id);
        }
    }
}
