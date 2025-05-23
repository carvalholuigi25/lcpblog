using Moq;
using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Controllers;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;

namespace lcpblogapi.tests
{
    public class UsersControllerTests : ControllerBase
    {
        private readonly Mock<IUsersRepo> _mockRepo;
        private readonly UsersController _controller;

        public UsersControllerTests()
        {
            _mockRepo = new Mock<IUsersRepo>();
            _controller = new UsersController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllUsers_ReturnsActionResult_WithListOfUsers()
        {
            // Arrange
            var users = new List<User> { new User { UserId = 1, Username = "admin" }};
            var qryparams = new Models.QParams.QueryParams { Page = 1, PageSize = 1, Search = "", SortBy = "id", SortOrder = Models.QParams.SortOrderEnum.asc };

            _mockRepo.Setup(repo => repo.GetUsers(qryparams)).ReturnsAsync(users);

            // Act
            var result = await _controller.GetUsers(qryparams);

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<User>>>(result);
            var returnUsers = Assert.IsType<List<User>>(okResult.Value);

            Assert.Single(returnUsers);

            //Assert.Equal(1, returnUsers.Count);
        }

        [Fact]
        public async Task GetUserById_ReturnsActionResult_WithUser()
        {
            // Arrange
            var users = new User { UserId = 1, Username = "admin" };
            _mockRepo.Setup(repo => repo.GetUser(users.UserId)).ReturnsAsync(users);

            // Act
            var result = await _controller.GetUser(users.UserId);

            // Assert
            var okResult = Assert.IsType<ActionResult<User>>(result);
            var returnUser = Assert.IsType<User>(okResult.Value);
            Assert.Equal(users.UserId, returnUser.UserId);
            Assert.Equal(users.Username, returnUser.Username);
        }

        [Fact]
        public async Task GetUserById_ReturnsActionResult_WhenUserFound()
        {
            // Arrange
            var user = new User { UserId = 1, Username = "admin" };

            _mockRepo.Setup(repo => repo.GetUser(user.UserId)).ReturnsAsync(user);

            // Act
            var result = await _controller.GetUser(user.UserId);

            // Assert
            Assert.IsType<ActionResult<User>>(result);
        }

        [Fact]
        public async Task CreateUser_ReturnsCreatedAtActionResult_WithUser()
        {
            // Arrange
            var user = new User { UserId = 1, Username = "admin" };

            _mockRepo.Setup(repo => repo.PostUser(user)).ReturnsAsync(user);

            // Act
            var result = await _controller.PostUser(user);

            // Assert
            var createdAtActionResult = Assert.IsType<ActionResult<User>>(result);
            var returnUser = Assert.IsType<User>(createdAtActionResult.Value);
            Assert.Equal(user.UserId, returnUser.UserId);
            Assert.Equal(user.Username, returnUser.Username);
        }

        [Fact]
        public async Task UpdateUser_ReturnsOkObjectResult()
        {
            // Arrange
            var user = new User { UserId = 1, Username = "admin" };
            _mockRepo.Setup(repo => repo.PutUser(user.UserId, user)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.PutUser(user.UserId, user);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task UpdateUser_ReturnsOkResult_WhenUserFound()
        {
            // Arrange
            var user = new User { UserId = 1, Username = "admin" };
            _mockRepo.Setup(repo => repo.PutUser(user.UserId, user)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.PutUser(user.UserId, user);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteUser_ReturnsOkObjectResult()
        {
            // Arrange
            var userid = 1;
            _mockRepo.Setup(repo => repo.DeleteUser(userid)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.DeleteUser(userid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteUser_ReturnsOkObjectResult_WhenUserFound()
        {
            // Arrange
            var userid = 1;
            _mockRepo.Setup(repo => repo.DeleteUser(userid)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.DeleteUser(userid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}