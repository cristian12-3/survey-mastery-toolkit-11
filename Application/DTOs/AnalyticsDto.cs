
using System.Collections.Generic;

namespace SurveyApp.Application.DTOs
{
    public class AnalyticsDto
    {
        public int TotalSurveys { get; set; }
        public int TotalResponses { get; set; }
        public double AverageCompletionRate { get; set; }
        public Dictionary<string, int> QuestionTypeDistribution { get; set; } = new Dictionary<string, int>();
        public List<SurveyResponseTrendDto> ResponseTrends { get; set; } = new List<SurveyResponseTrendDto>();
    }

    public class SurveyResponseTrendDto
    {
        public string Date { get; set; }
        public int Responses { get; set; }
    }
}
