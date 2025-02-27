using Moq;
using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Controllers;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;

namespace lcpblogapi.tests
{
    public class FileMetadataControllerTests : ControllerBase
    {
        private readonly Mock<IFileMetadataRepo> _mockRepo;
        private readonly FileMetadataController _controller;

        public FileMetadataControllerTests()
        {
            _mockRepo = new Mock<IFileMetadataRepo>();
            _controller = new FileMetadataController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllFileMetadata_ReturnsActionResult_WithListOfFileMetadata()
        {
            // Arrange
            var FileMetadataList = new FileMetadata { Id = 1, gId = Guid.NewGuid(), FileName = "1234.png", FilePath = "uploads/1234.png" };

            _mockRepo.Setup(repo => repo.GetFileMetadata(FileMetadataList.Id.Value)).ReturnsAsync(FileMetadataList);

            // Act
            var result = await _controller.GetFileMetadata(FileMetadataList.Id.Value);

            // Assert
            var okResult = Assert.IsType<ActionResult<FileMetadata>>(result);
            var returnFileMetadata = Assert.IsType<FileMetadata>(okResult.Value);

            Assert.Equal(FileMetadataList.Id, returnFileMetadata.Id);
            Assert.Equal(FileMetadataList.gId, returnFileMetadata.gId);
            Assert.Equal(FileMetadataList.FileName, returnFileMetadata.FileName);
            Assert.Equal(FileMetadataList.FilePath, returnFileMetadata.FilePath);

            //Assert.Equal(1, returnFileMetadata.Count);
        }

        [Fact]
        public async Task GetFileMetadataById_ReturnsActionResult_WithFileMetadata()
        {
            // Arrange
            var FileMetadataList = new FileMetadata { Id = 1, gId = Guid.NewGuid(), FileName = "1234.png", FilePath = "uploads/1234.png" };
            _mockRepo.Setup(repo => repo.GetFileMetadata(FileMetadataList.Id)).ReturnsAsync(FileMetadataList);

            // Act
            var result = await _controller.GetFileMetadata(FileMetadataList.Id.Value);

            // Assert
            var okResult = Assert.IsType<ActionResult<FileMetadata>>(result);
            var returnFileMetadata = Assert.IsType<FileMetadata>(okResult.Value);
            Assert.Equal(FileMetadataList.Id, returnFileMetadata.Id);
            Assert.Equal(FileMetadataList.gId, returnFileMetadata.gId);
            Assert.Equal(FileMetadataList.FileName, returnFileMetadata.FileName);
            Assert.Equal(FileMetadataList.FilePath, returnFileMetadata.FilePath);
        }

        [Fact]
        public async Task GetFileMetadataById_ReturnsActionResult_WhenFileMetadataFound()
        {
            // Arrange
            var FileMetadataList = new FileMetadata { Id = 1, gId = Guid.NewGuid(), FileName = "1234.png", FilePath = "uploads/1234.png" };

            _mockRepo.Setup(repo => repo.GetFileMetadata(FileMetadataList.Id)).ReturnsAsync(FileMetadataList);

            // Act
            var result = await _controller.GetFileMetadata(FileMetadataList.Id.Value);

            // Assert
            Assert.IsType<ActionResult<FileMetadata>>(result);
        }

        [Fact]
        public async Task CreateFileMetadata_ReturnsCreatedAtActionResult_WithFileMetadata()
        {
            // Arrange
            var FileMetadataList = new FileMetadata { Id = 1, gId = Guid.NewGuid(), FileName = "1234.png", FilePath = "uploads/1234.png" };

            _mockRepo.Setup(repo => repo.CreateFileMetadata(FileMetadataList)).ReturnsAsync(FileMetadataList);

            // Act
            var result = await _controller.CreateFileMetadata(FileMetadataList);

            // Assert
            var createdAtActionResult = Assert.IsType<ActionResult<FileMetadata>>(result);
            var returnFileMetadata = Assert.IsType<FileMetadata>(createdAtActionResult.Value);
            Assert.Equal(FileMetadataList.Id, returnFileMetadata.Id);
            Assert.Equal(FileMetadataList.gId, returnFileMetadata.gId);
            Assert.Equal(FileMetadataList.FileName, returnFileMetadata.FileName);
            Assert.Equal(FileMetadataList.FilePath, returnFileMetadata.FilePath);
        }

        [Fact]
        public async Task UpdateFileMetadata_ReturnsOkObjectResult()
        {
            // Arrange
            var FileMetadataList = new FileMetadata { Id = 1, gId = Guid.NewGuid(), FileName = "1234.png", FilePath = "uploads/1234.png" };

            _mockRepo.Setup(repo => repo.PutFileMetadata(FileMetadataList.Id, FileMetadataList)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.PutFileMetadata(FileMetadataList.Id.Value, FileMetadataList);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task UpdateFileMetadata_ReturnsOkResult_WhenFileMetadataFound()
        {
            // Arrange
            var FileMetadataList = new FileMetadata { Id = 1, gId = Guid.NewGuid(), FileName = "1234.png", FilePath = "uploads/1234.png" };

            _mockRepo.Setup(repo => repo.PutFileMetadata(FileMetadataList.Id, FileMetadataList)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.PutFileMetadata(FileMetadataList.Id.Value, FileMetadataList);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteFileMetadata_ReturnsOkObjectResult()
        {
            // Arrange
            var FileMetadataid = 1;
            _mockRepo.Setup(repo => repo.DeleteFileMetadata(FileMetadataid)).ReturnsAsync(Ok(true));

            // Act
            var result = await _controller.DeleteFileMetadata(FileMetadataid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteFileMetadata_ReturnsOkObjectResult_WhenFileMetadataFound()
        {
            // Arrange
            var FileMetadataid = 1;
            _mockRepo.Setup(repo => repo.DeleteFileMetadata(FileMetadataid)).ReturnsAsync(Ok(false));

            // Act
            var result = await _controller.DeleteFileMetadata(FileMetadataid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}