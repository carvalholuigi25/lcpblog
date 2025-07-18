using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface IPostsRepo {
    Task<ActionResult<IEnumerable<Post>>> GetPosts(QueryParams queryParams);  
    Task<ActionResult<Post>> GetPost(int? id); 
    Task<ActionResult<Post>> CreatePost(Post post);
    Task<IActionResult> PutPost(int? id, Post post);
    Task<IActionResult> DeletePost(int? id);
    Task<ActionResult<Post>> UpdateViewsPost(int id, PostViews postViews);
    Task<ActionResult<IEnumerable<Post>>> GetAllPostsByUserId(int userId, int page = 1, int pageSize = 10);
    Task<ActionResult<IEnumerable<Post>>> GetPostsByTagName(string tagname);
    Task<ActionResult<IEnumerable<dynamic>>> GetArchivePost(int year);
    ActionResult<IEnumerable<Dataset>> GetDatasetPost(int year, string? lang = "en");
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}