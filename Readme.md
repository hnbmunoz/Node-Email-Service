# Node Email Service

A microservice for sending emails using Express.js with clean architecture principles. This service provides a RESTful API for sending emails with comprehensive validation, error handling, and Swagger documentation.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with the following layers:

```
src/
├── config/           # Configuration files
├── domain/           # Business logic layer
│   ├── entities/     # Domain entities
│   └── usecases/     # Business use cases
├── infrastructure/   # External services layer
│   └── repositories/ # Data access implementations
├── presentation/     # API layer
│   ├── controllers/  # HTTP controllers
│   ├── middleware/   # Express middleware
│   └── routes/       # API routes
└── server.js         # Application entry point
```

## 🚀 Features

- ✅ Clean Architecture implementation
- ✅ Email sending with Nodemailer
- ✅ Input validation with Joi
- ✅ Comprehensive error handling
- ✅ Swagger API documentation
- ✅ CORS and security middleware
- ✅ Environment-based configuration
- ✅ Health check endpoints
- ✅ Support for HTML and plain text emails
- ✅ CC, BCC, and attachments support

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Email service provider (Gmail, SendGrid, etc.)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd node-email-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Update the `.env` file with your email configuration:**
   ```env
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # API Configuration
   API_VERSION=v1
   ```

## 🔧 Gmail Setup

To use Gmail as your email provider:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in the `EMAIL_PASS` environment variable

## 🚀 Running the Service

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The service will start on `http://localhost:3000` (or your configured PORT).

## 📚 API Documentation

Once the service is running, visit:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **API Info**: `http://localhost:3000/api`

## 🔗 API Endpoints

### Base URL: `http://localhost:3000/api/v1/email`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/send`  | Send an email |
| GET    | `/test`  | Test email service connection |
| GET    | `/health` | Health check |

### Send Email

**POST** `/api/v1/email/send`

**Request Body:**
```json
{
  "to": ["recipient@example.com"],
  "subject": "Test Email",
  "text": "Plain text content",
  "html": "<h1>HTML content</h1>",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "from": "custom-sender@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "messageId": "<message-id@example.com>",
    "to": ["recipient@example.com"],
    "subject": "Test Email",
    "sentAt": "2023-12-01T10:30:00.000Z"
  }
}
```

### Test Connection

**GET** `/api/v1/email/test`

**Response:**
```json
{
  "success": true,
  "message": "Email service connection is working"
}
```

### Health Check

**GET** `/api/v1/email/health`

**Response:**
```json
{
  "success": true,
  "message": "Email service is running",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "version": "1.0.0"
}
```

## 🧪 Testing with cURL

### Send a simple email:
```bash
curl -X POST http://localhost:3000/api/v1/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["recipient@example.com"],
    "subject": "Test Email",
    "text": "This is a test email from the Node Email Service!"
  }'
```

### Test connection:
```bash
curl http://localhost:3000/api/v1/email/test
```

### Health check:
```bash
curl http://localhost:3000/api/v1/email/health
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Built-in Express rate limiting
- **Environment Variables**: Sensitive data protection

## 🐛 Error Handling

The service provides comprehensive error handling with appropriate HTTP status codes:

- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error
- `503`: Service Unavailable (email service issues)

## 📁 Project Structure

```
node-email-service/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuration management
│   │   └── swagger.js           # Swagger configuration
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Email.js         # Email entity
│   │   └── usecases/
│   │       └── SendEmailUseCase.js # Email sending use case
│   ├── infrastructure/
│   │   └── repositories/
│   │       └── EmailRepository.js # Email service implementation
│   ├── presentation/
│   │   ├── controllers/
│   │   │   └── EmailController.js # HTTP controllers
│   │   ├── middleware/
│   │   │   └── validation.js    # Validation middleware
│   │   └── routes/
│   │       └── emailRoutes.js   # API routes
│   └── server.js                # Application entry point
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the error messages in the API responses

## 🔄 Version History

- **v1.0.0**: Initial release with basic email sending functionality
