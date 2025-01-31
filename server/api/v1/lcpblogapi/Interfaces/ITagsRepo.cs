using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface ITagsRepo {
    Task<ActionResult<IEnumerable<Tag>>> GetTags(QueryParams queryParams);  
    Task<ActionResult<Tag>> GetTag(int? id); 
    Task<ActionResult<Tag>> CreateTag(Tag Tag);
    Task<IActionResult> PutTag(int? id, Tag Tag);
    Task<IActionResult> DeleteTag(int? id);
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}