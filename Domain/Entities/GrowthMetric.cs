
using System;

namespace SurveyApp.Domain.Entities
{
    public class GrowthMetric
    {
        public Guid Id { get; private set; }
        public string Period { get; private set; }
        public decimal Revenue { get; private set; }
        public int UserCount { get; private set; }

        public GrowthMetric(string period, decimal revenue, int userCount)
        {
            Id = Guid.NewGuid();
            Period = period;
            Revenue = revenue;
            UserCount = userCount;
        }
    }
}
