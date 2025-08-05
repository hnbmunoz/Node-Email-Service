const Email = require('../entities/Email');

class SendEmailUseCase {
  constructor(emailRepository) {
    this.emailRepository = emailRepository;
  }

  async execute(emailData) {
    try {
      // Create email entity
      const email = new Email(emailData);

      // Validate email
      const validation = email.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Send email through repository
      const result = await this.emailRepository.send(email);

      return {
        success: true,
        message: 'Email sent successfully',
        data: {
          messageId: result.messageId,
          to: email.to,
          subject: email.subject,
          sentAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send email',
        error: error.message
      };
    }
  }
}

module.exports = SendEmailUseCase;