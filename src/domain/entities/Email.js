class Email {
  constructor({ to, subject, text, html, from, cc, bcc, attachments }) {
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
    this.from = from;
    this.cc = cc;
    this.bcc = bcc;
    this.attachments = attachments;
    this.createdAt = new Date();
  }

  validate() {
    const errors = [];

    if (!this.to || !Array.isArray(this.to) || this.to.length === 0) {
      errors.push('Recipients (to) are required and must be a non-empty array');
    }

    if (!this.subject || this.subject.trim().length === 0) {
      errors.push('Subject is required');
    }

    if (!this.text && !this.html) {
      errors.push('Either text or html content is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (this.to) {
      this.to.forEach((email, index) => {
        if (!emailRegex.test(email)) {
          errors.push(`Invalid email format at index ${index}: ${email}`);
        }
      });
    }

    if (this.cc && Array.isArray(this.cc)) {
      this.cc.forEach((email, index) => {
        if (!emailRegex.test(email)) {
          errors.push(`Invalid CC email format at index ${index}: ${email}`);
        }
      });
    }

    if (this.bcc && Array.isArray(this.bcc)) {
      this.bcc.forEach((email, index) => {
        if (!emailRegex.test(email)) {
          errors.push(`Invalid BCC email format at index ${index}: ${email}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      to: this.to,
      subject: this.subject,
      text: this.text,
      html: this.html,
      from: this.from,
      cc: this.cc,
      bcc: this.bcc,
      attachments: this.attachments,
      createdAt: this.createdAt
    };
  }
}

module.exports = Email;