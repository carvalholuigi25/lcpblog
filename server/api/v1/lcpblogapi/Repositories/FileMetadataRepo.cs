using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lcpblogapi.Context;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;

namespace lcpblogapi.Repositories;

public class FileMetadataRepo : ControllerBase, IFileMetadataRepo
{
    private readonly MyDBContext _context;

    private MyDBSQLFunctions _myDBSQLFunctions;

    public FileMetadataRepo(MyDBContext context, MyDBSQLFunctions myDBSQLFunctions)
    {
        _context = context;
        _myDBSQLFunctions = myDBSQLFunctions;
    }

    public async Task<ActionResult<IEnumerable<FileMetadata>>> GetFileMetadatas(QueryParams queryParams)
    {
        var query = _context.FilesMetadata.AsQueryable();
        var totalCount = await GetTotalCountAsync(queryParams);

        // Filtering
        query = GetFilterData(query, queryParams);

        // Sorting
        query = GetSortByData(query, queryParams);

        // Pagination
        query = GetPaginationData(query, queryParams);

        var response = new QueryParamsResp<FileMetadata>
        {
            TotalCount = totalCount,
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            Data = await query.ToListAsync()
        };

        return Ok(response);
    }

    public async Task<ActionResult<FileMetadata>> GetFileMetadata(int? id)
    {
        var filemetadata = await _context.FilesMetadata.FindAsync(id);

        if (filemetadata == null)
        {
            return NotFound();
        }

        return filemetadata;
    }

    public async Task<ActionResult<FileMetadata>> CreateFileMetadata(FileMetadata filemetadata)
    {
        _context.FilesMetadata.Add(filemetadata);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFileMetadata), new { id = filemetadata.Id }, filemetadata);
    }

    public async Task<IActionResult> PutFileMetadata(int? id, FileMetadata filemetadata)
    {
        if (id != filemetadata.Id)
        {
            return BadRequest();
        }

        _context.Entry(filemetadata).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FileMetadataExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    public async Task<IActionResult> DeleteFileMetadata(int? id)
    {
        var filemetadata = await _context.FilesMetadata.FindAsync(id);

        if (filemetadata == null)
        {
            return NotFound();
        }

        _context.FilesMetadata.Remove(filemetadata);
        await _myDBSQLFunctions.ResetAIID("filemetadatas", 0);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    public async Task<int> GetTotalCountAsync(QueryParams queryParams)
    {
        var query = _context.FilesMetadata.AsQueryable();

        // Filtering
        query = GetFilterData(query, queryParams);

        return await query.CountAsync();
    }

    private bool FileMetadataExists(int? id)
    {
        return _context.FilesMetadata.Any(e => e.Id == id);
    }

    private static IQueryable<FileMetadata> GetFilterData(IQueryable<FileMetadata> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.Search))
        {
            if (!string.IsNullOrEmpty(queryParams.SortBy))
            {
                query = queryParams.SortBy.ToLower() switch
                {
                    "filename" => query.Where(i => i.FileName!.ToLower().Contains(queryParams.Search.ToLower())),
                    "filepath" => query.Where(i => i.FilePath!.ToLower().Contains(queryParams.Search.ToLower())),
                    _ => query.Where(i => i.Id == int.Parse(queryParams.Search)),
                };
            }
        }

        return query;
    }

    private static IQueryable<FileMetadata> GetSortByData(IQueryable<FileMetadata> query, QueryParams queryParams)
    {
        if (!string.IsNullOrEmpty(queryParams.SortBy))
        {
            var sortorderval = queryParams.SortOrder!.Value.ToString();
            StringComparison strcom = StringComparison.OrdinalIgnoreCase;
            query = queryParams.SortBy.ToLower() switch
            {
                "filename" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.FileName) : query.OrderBy(i => i.FileName),
                "filepath" => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.FilePath) : query.OrderBy(i => i.FilePath),
                _ => sortorderval.Contains("desc", strcom) ? query.OrderByDescending(i => i.Id) : query.OrderBy(i => i.Id),
            };
        }

        return query;
    }

    private static IQueryable<FileMetadata> GetPaginationData(IQueryable<FileMetadata> query, QueryParams queryParams)
    {
        return query.Skip((queryParams.Page - 1) * queryParams.PageSize).Take(queryParams.PageSize);
    }
}