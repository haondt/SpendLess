using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Microsoft.VisualBasic.FileIO;
using System.Linq;
using SpendLess.Extensions;
using System.Security.Cryptography;

namespace SpendLess.Services
{
    public class TransactionIngester
    {
        /*
        public IEnumerable<OriginalTransaction> ReadCSV(Stream source)
        {
            List<OriginalTransaction> originalTransactions = new List<OriginalTransaction>();
            MD5 hash = MD5.Create();

            using (TextFieldParser csvParser = new TextFieldParser(source))
            {
                csvParser.CommentTokens = new string[] { "#" };
                csvParser.SetDelimiters(new string[] { "," });
                csvParser.HasFieldsEnclosedInQuotes = true;


                while (!csvParser.EndOfData)
                {
                    string[] fields = csvParser.ReadFields();

                    originalTransactions.Add(new OriginalTransaction
                    {
                        AccountId = null,
                        Vendor = null,
                        Date = DateTime.Parse(fields[0]),
                        Description = fields[1],
                        Value = decimal.Parse(fields[2]) - decimal.Parse(fields[3]),
                        Id = fields.Aggregate("", (s,S) => s + S).Hash(hash)
                    });
                }
            }

            return originalTransactions;
        }
        */
    }
}
