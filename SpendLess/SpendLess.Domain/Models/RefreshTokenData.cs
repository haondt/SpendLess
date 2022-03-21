using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Models
{
    public class RefreshTokenData
    {
        public DateTime Expiry { get; set; }
        public bool IsValid { get; set; }
        public string Username { get; set; }
    }
}
