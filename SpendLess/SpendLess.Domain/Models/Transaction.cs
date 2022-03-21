using System;
using System.Collections.Generic;
using System.Text;

namespace SpendLess.Domain.Models
{
    public class Transaction : IEquatable<Transaction>
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid Vendor { get; set; }
        public decimal Value { get; set; }
        public Guid Account { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public int HashCode { get; set; }
        public override int GetHashCode() => HashCode;
        public bool Equals(Transaction other) => this.HashCode == other.HashCode;
        public bool Recurring { get; set; }
        public string Category { get; set; }
    }
}
