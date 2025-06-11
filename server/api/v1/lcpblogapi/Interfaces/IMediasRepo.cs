using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface IMediasRepo {
    Task<ActionResult<IEnumerable<Media>>> GetAllMedias(QueryParams queryParams);  
    Task<ActionResult<Media>> GetMedia(int? id); 
    Task<ActionResult<Media>> CreateMedia(Media media);
    Task<IActionResult> PutMedia(int? id, Media media);
    Task<IActionResult> DeleteMedia(int? id);
    Task<ActionResult<IEnumerable<Media>>> GetAllMediasByUserId(int userId, int page = 1, int pageSize = 10);
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}