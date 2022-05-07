﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Dtos
{
    public class TransactionDto
    {
        public Guid Id { get; set; }
        public string ImportHash { get; set; }
        public Guid Vendor { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        public bool Recurring { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
    }
}