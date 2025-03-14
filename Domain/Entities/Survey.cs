
using System;
using System.Collections.Generic;

namespace SurveyApp.Domain.Entities
{
    public class Survey
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public List<Question> Questions { get; private set; } = new List<Question>();
        public DateTime CreatedAt { get; private set; }
        public int Responses { get; private set; }
        public int CompletionRate { get; private set; }
        public DeliveryConfig DeliveryConfig { get; private set; }

        public Survey(string title, string description)
        {
            Id = Guid.NewGuid();
            Title = title;
            Description = description;
            CreatedAt = DateTime.UtcNow;
            Responses = 0;
            CompletionRate = 0;
            DeliveryConfig = new DeliveryConfig();
        }

        public void UpdateTitle(string title)
        {
            Title = title;
        }

        public void UpdateDescription(string description)
        {
            Description = description;
        }

        public void AddQuestion(Question question)
        {
            Questions.Add(question);
        }

        public void RemoveQuestion(Question question)
        {
            Questions.Remove(question);
        }

        public void SetDeliveryConfig(DeliveryConfig deliveryConfig)
        {
            DeliveryConfig = deliveryConfig;
        }
    }
}
