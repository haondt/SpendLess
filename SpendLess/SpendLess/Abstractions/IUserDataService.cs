using SpendLess.Domain.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Abstractions
{
    public interface IUserDataService
    {
        public Task<UserInfoDto> GetUserInfo();
    }
}
