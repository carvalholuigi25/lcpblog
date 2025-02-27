using Moq;
using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Controllers;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;

namespace lcpblogapi.tests
{
    public class CategoriesControllerTests : ControllerBase
    {
        private readonly Mock<ICategoriesRepo> _mockRepo;
        private readonly CategoriesController _controller;

        public CategoriesControllerTests()
        {
            _mockRepo = new Mock<ICategoriesRepo>();
            _controller = new CategoriesController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllCategorys_ReturnsActionResult_WithListOfCategorys()
        {
            // Arrange
            var Categorys = new List<Category> { new Category { CategoryId = 1, Name = "geral" }};
            var qryparams = new Models.QParams.QueryParams { Page = 1, PageSize = 1, Search = "", SortBy = "id", SortOrder = Models.QParams.SortOrderEnum.asc };

            _mockRepo.Setup(repo => repo.GetCategories(qryparams)).ReturnsAsync(Categorys);

            // Act
            var result = await _controller.GetCategories(qryparams);

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<Category>>>(result);
            var returnCategorys = Assert.IsType<List<Category>>(okResult.Value);

            Assert.Single(returnCategorys);

            //Assert.Equal(1, returnCategorys.Count);
        }

        [Fact]
        public async Task GetCategoryById_ReturnsActionResult_WithCategory()
        {
            // Arrange
            var Categorys = new Category { CategoryId = 1, Name = "geral" };
            _mockRepo.Setup(repo => repo.GetCategory(Categorys.CategoryId)).ReturnsAsync(Categorys);

            // Act
            var result = await _controller.GetCategory(Categorys.CategoryId.Value);

            // Assert
            var okResult = Assert.IsType<ActionResult<Category>>(result);
            var returnCategory = Assert.IsType<Category>(okResult.Value);
            Assert.Equal(Categorys.CategoryId, returnCategory.CategoryId);
            Assert.Equal(Categorys.Name, returnCategory.Name);
        }

        [Fact]
        public async Task GetCategoryById_ReturnsActionResult_WhenCategoryFound()
        {
            // Arrange
            var Category = new Category { CategoryId = 1, Name = "geral" };

            _mockRepo.Setup(repo => repo.GetCategory(Category.CategoryId)).ReturnsAsync(Category);

            // Act
            var result = await _controller.GetCategory(Category.CategoryId.Value);

            // Assert
            Assert.IsType<ActionResult<Category>>(result);
        }

        [Fact]
        public async Task CreateCategory_ReturnsCreatedAtActionResult_WithCategory()
        {
            // Arrange
            var Category = new Category { CategoryId = 1, Name = "geral" };

            _mockRepo.Setup(repo => repo.CreateCategory(Category)).ReturnsAsync(Category);

            // Act
            var result = await _controller.CreateCategory(Category);

            // Assert
            var createdAtActionResult = Assert.IsType<ActionResult<Category>>(result);
            var returnCategory = Assert.IsType<Category>(createdAtActionResult.Value);
            Assert.Equal(Category.CategoryId, returnCategory.CategoryId);
            Assert.Equal(Category.Name, returnCategory.Name);
        }

        [Fact]
        public async Task UpdateCategory_ReturnsOkObjectResult()
        {
            // Arrange
            var Category = new Category { CategoryId = 1, Name = "geral" };
            _mockRepo.Setup(repo => repo.PutCategory(Category.CategoryId, Category)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.PutCategory(Category.CategoryId.Value, Category);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task UpdateCategory_ReturnsOkResult_WhenCategoryFound()
        {
            // Arrange
            var Category = new Category { CategoryId = 1, Name = "geral" };
            _mockRepo.Setup(repo => repo.PutCategory(Category.CategoryId, Category)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.PutCategory(Category.CategoryId.Value, Category);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteCategory_ReturnsOkObjectResult()
        {
            // Arrange
            var Categoryid = 1;
            _mockRepo.Setup(repo => repo.DeleteCategory(Categoryid)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.DeleteCategory(Categoryid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteCategory_ReturnsOkObjectResult_WhenCategoryFound()
        {
            // Arrange
            var Categoryid = 1;
            _mockRepo.Setup(repo => repo.DeleteCategory(Categoryid)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.DeleteCategory(Categoryid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}