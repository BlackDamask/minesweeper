﻿namespace Minesweeper.Services.EmailService
{
    public interface IEmailService
    {
        public Task SendEmailAsync(string toEmail, string subject, string body);
    }
}
