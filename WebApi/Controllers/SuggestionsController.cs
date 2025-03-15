
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SurveyApp.Application.DTOs;
using SurveyApp.Application.Services;
using SurveyApp.Domain.Entities;

namespace SurveyApp.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuggestionsController : ControllerBase
    {
        private readonly ISuggestionService _suggestionService;

        public SuggestionsController(ISuggestionService suggestionService)
        {
            _suggestionService = suggestionService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SuggestionDto>>> GetAllSuggestions()
        {
            var suggestions = await _suggestionService.GetAllSuggestionsAsync();
            return Ok(suggestions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuggestionDto>> GetSuggestionById(Guid id)
        {
            var suggestion = await _suggestionService.GetSuggestionByIdAsync(id);
            if (suggestion == null)
                return NotFound();

            return Ok(suggestion);
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<List<SuggestionDto>>> GetSuggestionsByStatus(string status)
        {
            if (!Enum.TryParse<SuggestionStatus>(status, true, out var suggestionStatus))
                return BadRequest("Invalid status value");

            var suggestions = await _suggestionService.GetSuggestionsByStatusAsync(suggestionStatus);
            return Ok(suggestions);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<SuggestionDto>>> GetSuggestionsByCategory(string category)
        {
            var suggestions = await _suggestionService.GetSuggestionsByCategoryAsync(category);
            return Ok(suggestions);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<SuggestionDto>>> SearchSuggestions([FromQuery] string query)
        {
            var suggestions = await _suggestionService.SearchSuggestionsAsync(query);
            return Ok(suggestions);
        }

        [HttpPost]
        public async Task<ActionResult<SuggestionDto>> CreateSuggestion(CreateSuggestionDto suggestionDto)
        {
            var suggestion = await _suggestionService.CreateSuggestionAsync(suggestionDto);
            return CreatedAtAction(nameof(GetSuggestionById), new { id = suggestion.Id }, suggestion);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateSuggestionStatus(Guid id, UpdateSuggestionStatusDto updateDto)
        {
            if (!Enum.TryParse<SuggestionStatus>(updateDto.Status, true, out var status))
                return BadRequest("Invalid status value");

            await _suggestionService.UpdateSuggestionStatusAsync(id, status, updateDto.Response);
            return NoContent();
        }

        [HttpGet("report/{months}")]
        public async Task<ActionResult<MonthlyReportDto>> GetMonthlyReport(int months)
        {
            if (months <= 0 || months > 12)
                return BadRequest("Months must be between 1 and 12");

            var report = await _suggestionService.GenerateMonthlyReportAsync(months);
            return Ok(report);
        }

        [HttpGet("similar")]
        public async Task<ActionResult<List<SuggestionDto>>> FindSimilarSuggestions([FromQuery] string content)
        {
            var suggestions = await _suggestionService.FindSimilarSuggestionsAsync(content);
            return Ok(suggestions);
        }
    }
}
