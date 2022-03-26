using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SpendLess.API.ExceptionFilters;
using System;
using System.Collections.Generic;

namespace SpendLess.API.Controllers
{
    [ApiController]
    [Authorize]
    [ExceptionFilter(typeof(KeyNotFoundException), 404)]
    [ExceptionFilter(typeof(InvalidOperationException), 400)]
    [ExceptionFilter(typeof(UnauthorizedAccessException), 401)]
    [ExceptionFilter(typeof(SecurityTokenException), 403)]
    [InheritableExceptionFilter(typeof(Exception), 500)]
    [Produces("application/json")]
    [Route("api")]
    public class BaseController
    {
    }
}
