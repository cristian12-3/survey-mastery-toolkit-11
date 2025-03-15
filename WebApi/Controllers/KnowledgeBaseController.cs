
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SurveyApp.Application.DTOs;
using SurveyApp.Application.Services;

namespace SurveyApp.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KnowledgeBaseController : ControllerBase
    {
        private readonly IKnowledgeBaseService _knowledgeBaseService;

        public KnowledgeBaseController(IKnowledgeBaseService knowledgeBaseService)
        {
            _knowledgeBaseService = knowledgeBaseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<KnowledgeBaseItemDto>>> GetAllItems()
        {
            var items = await _knowledgeBaseService.GetAllItemsAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<KnowledgeBaseItemDto>> GetItemById(Guid id)
        {
            var item = await _knowledgeBaseService.GetItemByIdAsync(id);
            if (item == null)
                return NotFound();

            return Ok(item);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<KnowledgeBaseItemDto>>> GetItemsByCategory(string category)
        {
            var items = await _knowledgeBaseService.GetItemsByCategoryAsync(category);
            return Ok(items);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<KnowledgeBaseItemDto>>> SearchItems([FromQuery] string query)
        {
            var items = await _knowledgeBaseService.SearchItemsAsync(query);
            return Ok(items);
        }

        [HttpPost]
        public async Task<ActionResult<KnowledgeBaseItemDto>> CreateItem(CreateKnowledgeBaseItemDto itemDto)
        {
            var item = await _knowledgeBaseService.CreateItemAsync(itemDto);
            return CreatedAtAction(nameof(GetItemById), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(Guid id, UpdateKnowledgeBaseItemDto itemDto)
        {
            await _knowledgeBaseService.UpdateItemAsync(id, itemDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            await _knowledgeBaseService.DeleteItemAsync(id);
            return NoContent();
        }
    }
}
