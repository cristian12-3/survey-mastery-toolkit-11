
using System;
using System.Collections.Generic;

namespace SurveyApp.Domain.Entities
{
    public class KnowledgeBaseArticle
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Author { get; set; } = string.Empty;
        public List<string> RelatedTags { get; set; } = new List<string>();
    }
}
