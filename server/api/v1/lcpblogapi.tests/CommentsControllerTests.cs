using Moq;
using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Controllers;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;

namespace lcpblogapi.tests
{
    public class CommentsControllerTests : ControllerBase
    {
        private readonly Mock<ICommentsRepo> _mockRepo;
        private readonly CommentsController _controller;

        public CommentsControllerTests()
        {
            _mockRepo = new Mock<ICommentsRepo>();
            _controller = new CommentsController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllComments_ReturnsActionResult_WithListOfComments()
        {
            // Arrange
            var Comments = new List<Comment> { new Comment { CommentId = 1, Content = "Hello world!" }};
            var qryparams = new Models.QParams.QueryParams { Page = 1, PageSize = 1, Search = "", SortBy = "id", SortOrder = Models.QParams.SortOrderEnum.asc };

            _mockRepo.Setup(repo => repo.GetComments(qryparams)).ReturnsAsync(Comments);

            // Act
            var result = await _controller.GetComments(qryparams);

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<Comment>>>(result);
            var returnComments = Assert.IsType<List<Comment>>(okResult.Value);

            Assert.Single(returnComments);

            //Assert.Equal(1, returnComments.Count);
        }

        [Fact]
        public async Task GetCommentById_ReturnsActionResult_WithComment()
        {
            // Arrange
            var Comments = new Comment { CommentId = 1, Content = "Hello world!" };
            _mockRepo.Setup(repo => repo.GetComment(Comments.CommentId)).ReturnsAsync(Comments);

            // Act
            var result = await _controller.GetComment(Comments.CommentId.Value);

            // Assert
            var okResult = Assert.IsType<ActionResult<Comment>>(result);
            var returnComment = Assert.IsType<Comment>(okResult.Value);
            Assert.Equal(Comments.CommentId, returnComment.CommentId);
            Assert.Equal(Comments.Content, returnComment.Content);
        }

        [Fact]
        public async Task GetCommentById_ReturnsActionResult_WhenCommentFound()
        {
            // Arrange
            var Comment = new Comment { CommentId = 1, Content = "Hello world!" };

            _mockRepo.Setup(repo => repo.GetComment(Comment.CommentId)).ReturnsAsync(Comment);

            // Act
            var result = await _controller.GetComment(Comment.CommentId.Value);

            // Assert
            Assert.IsType<ActionResult<Comment>>(result);
        }

        [Fact]
        public async Task CreateComment_ReturnsCreatedAtActionResult_WithComment()
        {
            // Arrange
            var Comment = new Comment { CommentId = 1, Content = "Hello world!" };

            _mockRepo.Setup(repo => repo.CreateComment(Comment)).ReturnsAsync(Comment);

            // Act
            var result = await _controller.CreateComment(Comment);

            // Assert
            var createdAtActionResult = Assert.IsType<ActionResult<Comment>>(result);
            var returnComment = Assert.IsType<Comment>(createdAtActionResult.Value);
            Assert.Equal(Comment.CommentId, returnComment.CommentId);
            Assert.Equal(Comment.Content, returnComment.Content);
        }

        [Fact]
        public async Task UpdateComment_ReturnsOkObjectResult()
        {
            // Arrange
            var Comment = new Comment { CommentId = 1, Content = "Hello world!" };
            _mockRepo.Setup(repo => repo.PutComment(Comment.CommentId, Comment)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.PutComment(Comment.CommentId.Value, Comment);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task UpdateComment_ReturnsOkResult_WhenCommentFound()
        {
            // Arrange
            var Comment = new Comment { CommentId = 1, Content = "Hello world!" };
            _mockRepo.Setup(repo => repo.PutComment(Comment.CommentId, Comment)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.PutComment(Comment.CommentId.Value, Comment);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteComment_ReturnsOkObjectResult()
        {
            // Arrange
            var Commentid = 1;
            _mockRepo.Setup(repo => repo.DeleteComment(Commentid)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.DeleteComment(Commentid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteComment_ReturnsOkObjectResult_WhenCommentFound()
        {
            // Arrange
            var Commentid = 1;
            _mockRepo.Setup(repo => repo.DeleteComment(Commentid)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.DeleteComment(Commentid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}