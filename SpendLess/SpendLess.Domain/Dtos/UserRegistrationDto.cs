using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Dtos
{
    public class UserRegistrationDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
    }
}
