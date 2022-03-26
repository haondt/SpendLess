using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SpendLess.Abstractions;
using SpendLess.API.ExceptionFilters;

namespace SpendLess.API.Controllers
{
    public class UserInfoController : BaseController
    {

        private readonly ILogger<UserInfoController> _logger;
        private readonly IUserDataService _userDataService;

        public UserInfoController(ILogger<UserInfoController> logger, IUserDataService userDataService)
        {
            _logger = logger;
            _userDataService = userDataService;
        }

        [HttpGet]
        [Route("user-info")]
        public async Task<IActionResult> GetUserInfo()
        {
            return new OkObjectResult(await _userDataService.GetUserInfo());
        }
    }
}
