const nodemailer = require('nodemailer');
const config = require('../../config/database');

class EmailRepository {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.auth.user,
          pass: config.email.auth.pass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Email transporter verification failed:', error);
        } else {
          console.log('Email transporter is ready to send messages');
        }
      });
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
      throw new Error('Email service initialization failed');
    }
  }

  async send(email) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const mailOptions = {
        from: email.from || config.email.auth.user,
        to: Array.isArray(email.to) ? email.to.join(', ') : email.to,
        subject: email.subject,
        text: email.text,
        html: email.html
      };

      // Add optional fields if they exist
      if (email.cc && email.cc.length > 0) {
        mailOptions.cc = Array.isArray(email.cc) ? email.cc.join(', ') : email.cc;
      }

      if (email.bcc && email.bcc.length > 0) {
        mailOptions.bcc = Array.isArray(email.bcc) ? email.bcc.join(', ') : email.bcc;
      }

      if (email.attachments && email.attachments.length > 0) {
        mailOptions.attachments = email.attachments;
      }

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        messageId: result.messageId,
        response: result.response,
        accepted: result.accepted,
        rejected: result.rejected
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      await this.transporter.verify();
      return { success: true, message: 'Email service connection is working' };
    } catch (error) {
      return { success: false, message: `Email service connection failed: ${error.message}` };
    }
  }
}

module.exports = EmailRepository;