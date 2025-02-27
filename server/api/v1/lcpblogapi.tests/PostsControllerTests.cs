using Moq;
using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Controllers;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;

namespace lcpblogapi.tests
{
    public class PostsControllerTests : ControllerBase
    {
        private readonly Mock<IPostsRepo> _mockRepo;
        private readonly PostsController _controller;

        public PostsControllerTests()
        {
            _mockRepo = new Mock<IPostsRepo>();
            _controller = new PostsController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllPosts_ReturnsActionResult_WithListOfPosts()
        {
            // Arrange
            var Posts = new List<Post> { new Post { PostId = 1, Title = "Welcome to LCPBlog!" }};
            var qryparams = new Models.QParams.QueryParams { Page = 1, PageSize = 1, Search = "", SortBy = "id", SortOrder = Models.QParams.SortOrderEnum.asc };

            _mockRepo.Setup(repo => repo.GetPosts(qryparams)).ReturnsAsync(Posts);

            // Act
            var result = await _controller.GetPosts(qryparams);

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<Post>>>(result);
            var returnPosts = Assert.IsType<List<Post>>(okResult.Value);

            Assert.Single(returnPosts);

            //Assert.Equal(1, returnPosts.Count);
        }

        [Fact]
        public async Task GetPostById_ReturnsActionResult_WithPost()
        {
            // Arrange
            var Posts = new Post { PostId = 1, Title = "Welcome to LCPBlog!" };
            _mockRepo.Setup(repo => repo.GetPost(Posts.PostId)).ReturnsAsync(Posts);

            // Act
            var result = await _controller.GetPost(Posts.PostId.Value);

            // Assert
            var okResult = Assert.IsType<ActionResult<Post>>(result);
            var returnPost = Assert.IsType<Post>(okResult.Value);
            Assert.Equal(Posts.PostId, returnPost.PostId);
            Assert.Equal(Posts.Title, returnPost.Title);
        }

        [Fact]
        public async Task GetPostById_ReturnsActionResult_WhenPostFound()
        {
            // Arrange
            var Post = new Post { PostId = 1, Title = "Welcome to LCPBlog!" };

            _mockRepo.Setup(repo => repo.GetPost(Post.PostId)).ReturnsAsync(Post);

            // Act
            var result = await _controller.GetPost(Post.PostId.Value);

            // Assert
            Assert.IsType<ActionResult<Post>>(result);
        }

        [Fact]
        public async Task CreatePost_ReturnsCreatedAtActionResult_WithPost()
        {
            // Arrange
            var Post = new Post { PostId = 1, Title = "Welcome to LCPBlog!" };

            _mockRepo.Setup(repo => repo.CreatePost(Post)).ReturnsAsync(Post);

            // Act
            var result = await _controller.CreatePost(Post);

            // Assert
            var createdAtActionResult = Assert.IsType<ActionResult<Post>>(result);
            var returnPost = Assert.IsType<Post>(createdAtActionResult.Value);
            Assert.Equal(Post.PostId, returnPost.PostId);
            Assert.Equal(Post.Title, returnPost.Title);
        }

        [Fact]
        public async Task UpdatePost_ReturnsOkObjectResult()
        {
            // Arrange
            var Post = new Post { PostId = 1, Title = "Welcome to LCPBlog!" };
            _mockRepo.Setup(repo => repo.PutPost(Post.PostId, Post)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.PutPost(Post.PostId.Value, Post);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task UpdatePost_ReturnsOkResult_WhenPostFound()
        {
            // Arrange
            var Post = new Post { PostId = 1, Title = "Welcome to LCPBlog!" };
            _mockRepo.Setup(repo => repo.PutPost(Post.PostId, Post)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.PutPost(Post.PostId.Value, Post);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeletePost_ReturnsOkObjectResult()
        {
            // Arrange
            var postid = 1;
            _mockRepo.Setup(repo => repo.DeletePost(postid)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.DeletePost(postid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeletePost_ReturnsOkObjectResult_WhenPostFound()
        {
            // Arrange
            var postid = 1;
            _mockRepo.Setup(repo => repo.DeletePost(postid)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.DeletePost(postid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}