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
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}