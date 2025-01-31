using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface ICategoriesRepo {
    Task<ActionResult<IEnumerable<Category>>> GetCategories(QueryParams queryParams);  
    Task<ActionResult<Category>> GetCategory(int? id); 
    Task<ActionResult<Category>> CreateCategory(Category Category);
    Task<IActionResult> PutCategory(int? id, Category Category);
    Task<IActionResult> DeleteCategory(int? id);
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}