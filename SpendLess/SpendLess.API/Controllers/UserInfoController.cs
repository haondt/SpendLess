using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SpendLess.Abstractions;
using SpendLess.Abstractions.Providers;
using SpendLess.API.ExceptionFilters;
using SpendLess.Authentication.Abstractions;
using SpendLess.Core.Dtos;
using SpendLess.Core.Models;
using SpendLess.Domain.Extensions;

namespace SpendLess.API.Controllers
{
    public class UserInfoController : BaseController
    {

        private readonly ILogger<UserInfoController> _logger;
        private readonly IUserProvider _userProvider;
        private readonly IPrincipalService _principalService;

        public UserInfoController(ILogger<UserInfoController> logger, IUserProvider userProvider, IPrincipalService principalService)
        {
            _logger = logger;
            _userProvider = userProvider;
            _principalService = principalService;
        }

        [HttpGet]
        [Route("user-info")]
        public async Task<IActionResult> Get()
        {
            var username = _principalService.GetUsername();
            var user = await _userProvider.GetAsync();

            return new OkObjectResult(new UserInfoDto
            {
                Username = username,
                Name = user.Name,
                SiteData = user.SiteData
            });
        }

        [HttpGet]
        [Route("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var user = await _userProvider.GetAsync();
            return new OkObjectResult(Map(user.Categories));
        }

        [HttpPost]
        [Route("categories")]
        public async Task<IActionResult> UpsertCategories([FromBody] List<CategoryDto> categoryDtos)
        {
            var user = await _userProvider.GetAsync();
            user.Categories = ReverseMap(categoryDtos).ToList();
            user = await _userProvider.UpsertAsync(user);
            return new OkObjectResult(Map(user.Categories));
        }

        [HttpGet]
        [Route("vendors")]
        public async Task<IActionResult> GetVendors()
        {
            var user = await _userProvider.GetAsync();
            return new OkObjectResult(Map(user.Vendors));
        }

        [HttpPost]
        [Route("vendors")]
        public async Task<IActionResult> UpsertVendors([FromBody] List<VendorDto> vendorDtos)
        {
            var user = await _userProvider.GetAsync();
            user.Vendors = ReverseMap(vendorDtos).ToList();
            user = await _userProvider.UpsertAsync(user);
            return new OkObjectResult(Map(user.Vendors));
        }

        private IEnumerable<CategoryDto> Map(IEnumerable<Category> categories)
        {
            return categories.Select(c => new CategoryDto
            {
                Name = c.Name,
                Children = Map(c.Children).ToList()
            });
        }

        private IEnumerable<VendorDto> Map(IEnumerable<Vendor> vendors)
        {
            return vendors.Select(v => new VendorDto
            {
                Name = v.Name,
                DefaultCategory = v.DefaultCategory,
                DefaultDescription = v.DefaultDescription,
                DefaultIsRecurring = v.DefaultIsRecurring,
            });
        }

        private IEnumerable<Category> ReverseMap(IEnumerable<CategoryDto> categoryDtos)
        {
            return categoryDtos.Select(c => new Category
            {
                Name = c.Name.FormatForDisplay(),
                Children = ReverseMap(c.Children).ToList()
            });
        }

        private IEnumerable<Vendor> ReverseMap(IEnumerable<VendorDto> vendorDtos)
        {
            var textInfo = System.Globalization.CultureInfo.CurrentCulture.TextInfo;
            return vendorDtos.Select(v => new Vendor
            {
                Name = v.Name.FormatForDisplay(),
                DefaultCategory = v.DefaultCategory.FormatForDisplay(),
                DefaultDescription = v.DefaultDescription,
                DefaultIsRecurring = v.DefaultIsRecurring,
            });
        }
    }
}
