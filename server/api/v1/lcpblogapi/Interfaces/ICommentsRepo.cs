using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface ICommentsRepo {
    Task<ActionResult<IEnumerable<Comment>>> GetComments(QueryParams queryParams);  
    Task<ActionResult<Comment>> GetComment(int? id); 
    Task<ActionResult<IEnumerable<Comment>>> GetCommentByPost(int? postId);
    Task<ActionResult<Comment>> CreateComment(Comment Comment);
    Task<IActionResult> PutComment(int? id, Comment Comment);
    Task<IActionResult> PutCommentByPost(int postId, int commentId, string status);
    Task<IActionResult> DeleteComment(int? id);
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}