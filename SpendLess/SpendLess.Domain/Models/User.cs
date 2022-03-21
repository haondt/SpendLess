using SpendLess.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string PasswordSalt { get; set; }
        public string PasswordHash { get; set; }

        public List<Bank> Banks { get; set; }
        public List<Vendor> Vendors { get; set; } = new List<Vendor>();
        public List<Category> Categories { get; set; } = new List<Category>();
        public List<SavingsGoal> SavingsGoals { get; set; } = new List<SavingsGoal>();
        public List<SpendingGoal> SpendingGoals { get; set; } = new List<SpendingGoal>();
        public List<TransactionDatapointMapping> datapointMappings { get; set; } = new List<TransactionDatapointMapping>();
    }
}
