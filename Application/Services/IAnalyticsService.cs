
using System.Threading.Tasks;
using SurveyApp.Application.DTOs;

namespace SurveyApp.Application.Services
{
    public interface IAnalyticsService
    {
        Task<AnalyticsDto> GetAnalyticsDataAsync();
        Task RefreshAnalyticsDataAsync();
    }
}
