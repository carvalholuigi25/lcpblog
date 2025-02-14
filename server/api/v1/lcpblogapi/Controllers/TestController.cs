using Microsoft.AspNetCore.Mvc;
using lcpblogapi.Models;
using lcpblogapi.Interfaces;
using lcpblogapi.Models.QParams;
using lcpblogapi.Authorization;
using lcpblogapi.Context;

namespace lcpblogapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private MyDBSQLFunctions _myDBSQLFunctions;

        public TestController(MyDBSQLFunctions myDBSQLFunctions)
        {
            _myDBSQLFunctions = myDBSQLFunctions;
        }

        [HttpPost("resetai/{tblname}/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetAI(string tblname = "posts", int id = 0) {
            return await _myDBSQLFunctions.ResetAIID(tblname, id);
        }
    }
}
