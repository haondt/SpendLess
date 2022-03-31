using System.ComponentModel.DataAnnotations;

namespace SpendLess.Configuration
{
    public class ImportSettings
    {
        public bool HasHeaderRow { get; set; } = false;
        public bool HasHeaderColumn { get; set; } = false;
    }
}