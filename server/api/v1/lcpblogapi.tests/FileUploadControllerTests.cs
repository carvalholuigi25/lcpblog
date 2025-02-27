using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using lcpblogapi.Controllers;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using Xunit;

namespace lcpblogapi.tests
{
    public class FileUploadControllerTests : ControllerBase
    {
        private readonly Mock<IFileService> _mockRepo;
        private readonly FileUploadController _controller;

        public FileUploadControllerTests()
        {
            _mockRepo = new Mock<IFileService>();
            _controller = new FileUploadController(_mockRepo.Object);
        }

        [Fact]
        public async Task UploadFile_ReturnsOkResult_WhenSingleFileIsUploaded()
        {
            // Arrange
            var mockFile = new Mock<IFormFile>();
            var content = "Hello World from a Fake File";
            var fileName = "test.txt";
            var ms = new MemoryStream();
            var writer = new StreamWriter(ms);
            writer.Write(content);
            writer.Flush();
            ms.Position = 0;

            mockFile.Setup(_ => _.OpenReadStream()).Returns(ms);
            mockFile.Setup(_ => _.FileName).Returns(fileName);
            mockFile.Setup(_ => _.Length).Returns(ms.Length);

            // Act
            var result = await _controller.UploadSingleFile(mockFile.Object);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(new { FilePath = okResult.Value }, new { FilePath = okResult.Value });
        }

        [Fact]
        public async Task UploadFiles_ReturnsOkResult_WhenMultipleFilesAreUploaded()
        {
            // Arrange
            var mockFiles = new List<IFormFile>();
            for (int i = 0; i < 3; i++)
            {
                var mockFile = new Mock<IFormFile>();
                var content = $"Hello World from Fake File {i}";
                var fileName = $"test{i}.txt";
                var ms = new MemoryStream();
                var writer = new StreamWriter(ms);
                writer.Write(content);
                writer.Flush();
                ms.Position = 0;

                mockFile.Setup(_ => _.OpenReadStream()).Returns(ms);
                mockFile.Setup(_ => _.FileName).Returns(fileName);
                mockFile.Setup(_ => _.Length).Returns(ms.Length);

                mockFiles.Add(mockFile.Object);
            }

            // Act
            var result = await _controller.UploadMultipleFiles(mockFiles);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(new { FilePaths = okResult.Value }, new { FilePaths = okResult.Value });
        }
    }
}
