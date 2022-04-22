using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SpendLess.Domain.Extensions
{
    public static class StringExtensions
    {
        public static string FormatForDisplay(this string s)
        {
            if (string.IsNullOrEmpty(s))
                return s;
            var textInfo = System.Globalization.CultureInfo.CurrentCulture.TextInfo;
            return textInfo.ToTitleCase(Regex.Replace(s, "[^a-zA-Z0-9_.]+", ""));
        }
    }
}
