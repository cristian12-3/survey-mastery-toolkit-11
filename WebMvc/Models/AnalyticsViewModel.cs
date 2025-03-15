
using System;
using System.Collections.Generic;

namespace SurveyApp.WebMvc.Models
{
    public class AnalyticsViewModel
    {
        public int TotalSurveys { get; set; }
        public int TotalResponses { get; set; }
        public double AverageCompletionRate { get; set; }
        public Dictionary<string, int> QuestionTypeDistribution { get; set; } = new Dictionary<string, int>();
        public List<ResponseTrendViewModel> ResponseTrends { get; set; } = new List<ResponseTrendViewModel>();
        public List<SurveyOverviewViewModel> RecentSurveys { get; set; } = new List<SurveyOverviewViewModel>();
    }

    public class ResponseTrendViewModel
    {
        public string Date { get; set; }
        public int Responses { get; set; }
    }

    public class SurveyOverviewViewModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public int Responses { get; set; }
        public int CompletionRate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
