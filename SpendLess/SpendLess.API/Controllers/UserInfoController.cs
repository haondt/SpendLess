using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SpendLess.Abstractions;
using SpendLess.Abstractions.Providers;
using SpendLess.API.ExceptionFilters;
using SpendLess.Authentication.Abstractions;

namespace SpendLess.API.Controllers
{
    public class UserInfoController : BaseController
    {

        private readonly ILogger<UserInfoController> _logger;
        private readonly IUserInfoProvider _userDataService;

        public UserInfoController(ILogger<UserInfoController> logger, IUserInfoProvider userDataService)
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
