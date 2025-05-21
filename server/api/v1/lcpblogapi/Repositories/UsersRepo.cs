using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lcpblogapi.Context;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;
using lcpblogapi.Helpers;

namespace lcpblogapi.Repositories;

public class UsersRepo : ControllerBase, IUsersRepo
{
    private readonly MyDBContext _context;
    private MyDBSQLFunctions _myDBSQLFunctions;

    public UsersRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
    }

    public async Task<ActionResult<IEnumerable<User>>> GetUsers(QueryParams queryParams)
    {
        var query = _context.Users.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<User> {
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<User>> GetUser(int? id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    public async Task<ActionResult<UserAvatarSearchResp>> GetAvatarUser(UserAvatarSearch userAvatarSearch) 
    {
        if(string.IsNullOrEmpty(userAvatarSearch.Email)) {
            return BadRequest("Please provide your email.");
        }

        var datasrch = await _context.Users.Where(x => x.Email! == userAvatarSearch.Email).Select(x => x.Avatar).FirstOrDefaultAsync();

        if(datasrch == null) {
            return (
                new UserAvatarSearchResp {
                    Avatar = "avatars/guest.png"
                }
            );
        }

        return Ok(
            new UserAvatarSearchResp {
                Avatar = datasrch
            }
        );
    }

    public async Task<ActionResult<User>> PostUser(User user)
    {
        if(!string.IsNullOrEmpty(user.Password) && !user.Password.StartsWith('$')) {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, 10, false);
        }

        if(!string.IsNullOrEmpty(user.Username) &&  _context.Users.Where(x => x.Username == user.Username).Count() == 1) {
            return BadRequest("Username already exists!");
        }

        if(!string.IsNullOrEmpty(user.Email) &&  _context.Users.Where(x => x.Email == user.Email).Count() == 1) {
            return BadRequest("Email already exists!");
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
    }

    public async Task<IActionResult> PutUser(int id, User user)
    {
        var istracking = false;
        var method = 0;

        if(!string.IsNullOrEmpty(user.Username) &&  _context.Users.Where(x => x.Username == user.Username).Count() > 1) {
            return BadRequest("Username already exists!");
        }

        if(!string.IsNullOrEmpty(user.Password) && !user.Password.StartsWith('$')) {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, 10, false);
        }

        if(!!istracking) {
            _context.Entry(user).State = EntityState.Modified;
        }

        try
        {
            var existingUser = !!istracking ? await _context.Users.FindAsync(id) : (method == 0 ? await _context.Users.FirstOrDefaultAsync(x => x.UserId == id) : _context.Users.GroupBy(g => g.UserId).Select(g => g.First()).ToList()[0]);
            
            existingUser!.UserId = id;
            existingUser!.Username = user.Username;
            existingUser!.Password = user.Password;
            existingUser!.Email = user.Email;
            existingUser!.DisplayName = user.DisplayName;
            existingUser!.Avatar = user.Avatar;
            existingUser!.Cover = user.Cover;
            existingUser!.About = user.About;
            existingUser!.Role = user.Role;
            existingUser!.Privacy = user.Privacy;

            _context.Users.Update(existingUser!);

            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        finally 
        {
            _context.ChangeTracker.Clear();
        }

        return NoContent();
    }

    public async Task<IActionResult> DeleteUser(int? id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user!);
        await _myDBSQLFunctions.ResetAIID("users", 0);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    public async Task<ActionResult<IEnumerable<Post>>> GetPostsByUserId(int? userId)
    {
        var post = await _context.Posts.Where(x => x.UserId == userId).ToListAsync();

        if (post == null)
        {
            return NotFound();
        }

        return post;
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.Users.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool UserExists(int? id)
    {
        return _context.Users.Any(e => e.UserId == id);
    }

    private static IQueryable<User> GetFilterData(IQueryable<User> query, QueryParams queryParams) {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.SortBy))
            {
                query = queryParams.SortBy.ToLower() switch
                {
                    "username" => query.Where(i => i.Username.Contains(queryParams.Search)),
                    "displayname" => query.Where(i => i.DisplayName!.Contains(queryParams.Search)),
                    "role" => query.Where(i => i.Role.ToString()!.Contains(queryParams.Search)),
                    _ => query.Where(i => i.UserId == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<User> GetSortByData(IQueryable<User> query, QueryParams queryParams) {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "username" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Username) : query.OrderBy(i => i.Username),
                "displayname" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.DisplayName) : query.OrderBy(i => i.DisplayName),
                "role" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Role) : query.OrderBy(i => i.Role),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.UserId) : query.OrderBy(i => i.UserId),
            };
        }

        return query;
    }

    private static IQueryable<User> GetPaginationData(IQueryable<User> query, QueryParams queryParams) {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}