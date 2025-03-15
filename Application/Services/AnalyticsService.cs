
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SurveyApp.Application.DTOs;
using SurveyApp.Application.Ports;
using SurveyApp.Domain.Entities;

namespace SurveyApp.Application.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IAnalyticsRepository _analyticsRepository;
        private readonly ISurveyRepository _surveyRepository;

        public AnalyticsService(IAnalyticsRepository analyticsRepository, ISurveyRepository surveyRepository)
        {
            _analyticsRepository = analyticsRepository;
            _surveyRepository = surveyRepository;
        }

        public async Task<AnalyticsDto> GetAnalyticsDataAsync()
        {
            var analyticsData = await _analyticsRepository.GetAnalyticsDataAsync();
            
            return new AnalyticsDto
            {
                TotalSurveys = analyticsData.TotalSurveys,
                TotalResponses = analyticsData.TotalResponses,
                AverageCompletionRate = analyticsData.AverageCompletionRate,
                QuestionTypeDistribution = analyticsData.QuestionTypeDistribution,
                ResponseTrends = analyticsData.ResponseTrends.Select(rt => new SurveyResponseTrendDto
                {
                    Date = rt.Date,
                    Responses = rt.Responses
                }).ToList()
            };
        }

        public async Task RefreshAnalyticsDataAsync()
        {
            var surveys = await _surveyRepository.GetAllAsync();
            
            var analyticsData = new AnalyticsData();
            
            // Calculate metrics
            int totalSurveys = surveys.Count;
            int totalResponses = surveys.Sum(s => s.Responses);
            double averageCompletionRate = surveys.Count > 0 
                ? surveys.Average(s => s.CompletionRate) 
                : 0;
            
            analyticsData.UpdateMetrics(totalSurveys, totalResponses, averageCompletionRate);
            
            // Calculate question type distribution
            var questionTypeDistribution = new Dictionary<string, int>();
            foreach (var survey in surveys)
            {
                foreach (var question in survey.Questions)
                {
                    string type = question.Type.ToString();
                    if (questionTypeDistribution.ContainsKey(type))
                    {
                        questionTypeDistribution[type]++;
                    }
                    else
                    {
                        questionTypeDistribution[type] = 1;
                    }
                }
            }
            analyticsData.SetQuestionTypeDistribution(questionTypeDistribution);
            
            // Calculate response trends (simplified)
            var lastSixMonths = Enumerable.Range(0, 6)
                .Select(i => DateTime.UtcNow.AddMonths(-i).ToString("MMM yyyy"))
                .ToList();
            
            var random = new Random();
            foreach (var month in lastSixMonths)
            {
                analyticsData.AddResponseTrend(new SurveyResponseTrend
                {
                    Date = month,
                    Responses = random.Next(50, 200) // Placeholder data
                });
            }
            
            await _analyticsRepository.UpdateAnalyticsDataAsync(analyticsData);
        }
    }
}
