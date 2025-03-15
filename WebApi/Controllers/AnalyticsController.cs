
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SurveyApp.Application.DTOs;
using SurveyApp.Application.Services;

namespace SurveyApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        // GET: api/analytics
        [HttpGet]
        public async Task<ActionResult<AnalyticsDto>> GetAnalyticsData()
        {
            var analyticsData = await _analyticsService.GetAnalyticsDataAsync();
            return Ok(analyticsData);
        }

        // POST: api/analytics/refresh
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshAnalyticsData()
        {
            await _analyticsService.RefreshAnalyticsDataAsync();
            return NoContent();
        }
    }
}
