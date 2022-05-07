﻿using System;
using System.Collections.Generic;
using System.Text;

namespace SpendLess.Core.Models
{
    public class Transaction
    {
        public string ImportHash { get; set; }
        public Guid AccountId { get; set; }
        public Guid Vendor { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        public bool Recurring { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
    }
}
