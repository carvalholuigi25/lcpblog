using Moq;
using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Controllers;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;

namespace lcpblogapi.tests
{
    public class TagsControllerTests : ControllerBase
    {
        private readonly Mock<ITagsRepo> _mockRepo;
        private readonly TagsController _controller;

        public TagsControllerTests()
        {
            _mockRepo = new Mock<ITagsRepo>();
            _controller = new TagsController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllTags_ReturnsActionResult_WithListOfTags()
        {
            // Arrange
            var Tags = new List<Tag> { new Tag { TagId = 1, Name = "tecnologia" }};
            var qryparams = new Models.QParams.QueryParams { Page = 1, PageSize = 1, Search = "", SortBy = "id", SortOrder = Models.QParams.SortOrderEnum.asc };

            _mockRepo.Setup(repo => repo.GetTags(qryparams)).ReturnsAsync(Tags);

            // Act
            var result = await _controller.GetTags(qryparams);

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<Tag>>>(result);
            var returnTags = Assert.IsType<List<Tag>>(okResult.Value);

            Assert.Single(returnTags);

            //Assert.Equal(1, returnTags.Count);
        }

        [Fact]
        public async Task GetTagById_ReturnsActionResult_WithTag()
        {
            // Arrange
            var Tags = new Tag { TagId = 1, Name = "tecnologia" };
            _mockRepo.Setup(repo => repo.GetTag(Tags.TagId.Value)).ReturnsAsync(Tags);

            // Act
            var result = await _controller.GetTag(Tags.TagId.Value);

            // Assert
            var okResult = Assert.IsType<ActionResult<Tag>>(result);
            var returnTag = Assert.IsType<Tag>(okResult.Value);
            Assert.Equal(Tags.TagId, returnTag.TagId);
            Assert.Equal(Tags.Name, returnTag.Name);
        }

        [Fact]
        public async Task GetTagById_ReturnsActionResult_WhenTagFound()
        {
            // Arrange
            var Tag = new Tag { TagId = 1, Name = "tecnologia" };

            _mockRepo.Setup(repo => repo.GetTag(Tag.TagId)).ReturnsAsync(Tag);

            // Act
            var result = await _controller.GetTag(Tag.TagId.Value);

            // Assert
            Assert.IsType<ActionResult<Tag>>(result);
        }

        [Fact]
        public async Task CreateTag_ReturnsCreatedAtActionResult_WithTag()
        {
            // Arrange
            var Tag = new Tag { TagId = 1, Name = "tecnologia" };

            _mockRepo.Setup(repo => repo.CreateTag(Tag)).ReturnsAsync(Tag);

            // Act
            var result = await _controller.CreateTag(Tag);

            // Assert
            var createdAtActionResult = Assert.IsType<ActionResult<Tag>>(result);
            var returnTag = Assert.IsType<Tag>(createdAtActionResult.Value);
            Assert.Equal(Tag.TagId, returnTag.TagId);
            Assert.Equal(Tag.Name, returnTag.Name);
        }

        [Fact]
        public async Task UpdateTag_ReturnsOkObjectResult()
        {
            // Arrange
            var Tag = new Tag { TagId = 1, Name = "tecnologia" };
            _mockRepo.Setup(repo => repo.PutTag(Tag.TagId, Tag)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.PutTag(Tag.TagId.Value, Tag);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task UpdateTag_ReturnsOkResult_WhenTagFound()
        {
            // Arrange
            var Tag = new Tag { TagId = 1, Name = "tecnologia" };
            _mockRepo.Setup(repo => repo.PutTag(Tag.TagId, Tag)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.PutTag(Tag.TagId.Value, Tag);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteTag_ReturnsOkObjectResult()
        {
            // Arrange
            var Tagid = 1;
            _mockRepo.Setup(repo => repo.DeleteTag(Tagid)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.DeleteTag(Tagid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteTag_ReturnsOkObjectResult_WhenTagFound()
        {
            // Arrange
            var Tagid = 1;
            _mockRepo.Setup(repo => repo.DeleteTag(Tagid)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.DeleteTag(Tagid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}