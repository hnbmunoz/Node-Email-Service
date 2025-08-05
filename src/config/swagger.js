const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./database');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node Email Service API',
      version: '1.0.0',
      description: 'A microservice for sending emails using Express.js with clean architecture',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Development server'
      },
      {
        url: 'https://your-production-domain.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Email',
        description: 'Email sending operations'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './src/presentation/routes/*.js',
    './src/presentation/controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true
  }
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};