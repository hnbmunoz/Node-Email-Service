const EmailRepository = require('./src/infrastructure/repositories/EmailRepository');
const SendEmailUseCase = require('./src/domain/usecases/SendEmailUseCase');

async function testEmail() {
  try {
    console.log('Testing email service...');
    
    // Initialize email repository
    const emailRepository = new EmailRepository();
    const sendEmailUseCase = new SendEmailUseCase(emailRepository);
    
    // Test connection first
    const connectionTest = await emailRepository.testConnection();
    console.log('Connection test:', connectionTest);
    
    if (connectionTest.success) {
      // Send a test email
      const testEmailData = {
        to: 'hnbmunoz@gmail.com', // sending to yourself for testing
        subject: 'Test Email - SMTP Configuration',
        text: 'This is a test email to verify SMTP configuration is working correctly.',
        html: '<h1>Test Email</h1><p>This is a test email to verify SMTP configuration is working correctly.</p>'
      };
      
      const result = await sendEmailUseCase.execute(testEmailData);
      console.log('Email send result:', result);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testEmail();