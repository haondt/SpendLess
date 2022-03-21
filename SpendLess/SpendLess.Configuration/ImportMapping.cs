namespace SpendLess.Configuration
{
    public class ImportMapping
    {
        public string DateFormat { get; set; }
        public int DescriptionColumn { get; set; }
        public int DateColumn { get; set; }
        public int CreditColumn { get; set; }
        public int DebitColumn { get; set; }
        public bool NegativeCredit { get; set; }
        public bool NegativeDebit { get; set; }
        public bool HasHeaderRow { get; set; }
        public bool HasHeaderColumn { get; set; }
    }
}