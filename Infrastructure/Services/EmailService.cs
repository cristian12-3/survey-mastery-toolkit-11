
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SurveyApp.Application.Ports;

namespace SurveyApp.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public async Task SendSurveyInvitationAsync(string toEmail, string surveyTitle, string surveyLink)
        {
            // In a real implementation, this would connect to an email service provider
            // For simplicity, we're just logging the email that would be sent
            _logger.LogInformation($"Sending survey invitation for '{surveyTitle}' to {toEmail}. Link: {surveyLink}");
            
            // Simulate async operation
            await Task.Delay(100);
        }
    }
}
