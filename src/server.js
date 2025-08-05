const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/database');
const emailRoutes = require('./presentation/routes/emailRoutes');
const { errorHandler, notFoundHandler } = require('./presentation/middleware/validation');
const { specs, swaggerUi, swaggerOptions } = require('./config/swagger');

class Server {
  constructor() {
    this.app = express();
    this.port = config.server.port;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"]
        }
      }
    }));

    // CORS middleware
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com'] 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Health check route
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Node Email Service is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
          swagger: '/api-docs',
          email: '/api/v1/email',
          health: '/api/v1/email/health',
          test: '/api/v1/email/test'
        }
      });
    });

    // Swagger documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

    // API routes
    this.app.use(`/api/${config.api.version}/email`, emailRoutes);

    // API info route
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'Node Email Service API',
        version: config.api.version,
        documentation: '/api-docs',
        endpoints: {
          sendEmail: `POST /api/${config.api.version}/email/send`,
          testConnection: `GET /api/${config.api.version}/email/test`,
          healthCheck: `GET /api/${config.api.version}/email/health`
        }
      });
    });
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log('='.repeat(50));
      console.log('🚀 Node Email Service Started Successfully!');
      console.log('='.repeat(50));
      console.log(`📧 Server running on: http://localhost:${this.port}`);
      console.log(`📚 API Documentation: http://localhost:${this.port}/api-docs`);
      console.log(`🔍 Health Check: http://localhost:${this.port}/api/${config.api.version}/email/health`);
      console.log(`🧪 Test Connection: http://localhost:${this.port}/api/${config.api.version}/email/test`);
      console.log(`📨 Send Email: POST http://localhost:${this.port}/api/${config.api.version}/email/send`);
      console.log('='.repeat(50));
      console.log(`Environment: ${config.server.nodeEnv}`);
      console.log(`Email Host: ${config.email.host}:${config.email.port}`);
      console.log(`Email User: ${config.email.auth.user || 'Not configured'}`);
      console.log('='.repeat(50));
    });
  }

  getApp() {
    return this.app;
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start();
}

module.exports = Server;