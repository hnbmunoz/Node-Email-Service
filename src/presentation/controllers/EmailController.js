const SendEmailUseCase = require('../../domain/usecases/SendEmailUseCase');
const EmailRepository = require('../../infrastructure/repositories/EmailRepository');

class EmailController {
  constructor() {
    this.emailRepository = new EmailRepository();
    this.sendEmailUseCase = new SendEmailUseCase(this.emailRepository);
  }

  async sendEmail(req, res) {
    try {
      const emailData = {
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html,
        from: req.body.from,
        cc: req.body.cc,
        bcc: req.body.bcc,
        attachments: req.body.attachments
      };

      const result = await this.sendEmailUseCase.execute(emailData);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
    } catch (error) {
      console.error('Email controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async testConnection(req, res) {
    try {
      const result = await this.emailRepository.testConnection();
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message
        });
      } else {
        return res.status(503).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Connection test error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getHealthCheck(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Email service is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    } catch (error) {
      console.error('Health check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Service unavailable',
        error: error.message
      });
    }
  }
}

module.exports = EmailController;