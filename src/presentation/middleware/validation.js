const Joi = require('joi');

const emailValidationSchema = Joi.object({
  to: Joi.array()
    .items(Joi.string().email().required())
    .min(1)
    .required()
    .messages({
      'array.base': 'Recipients must be an array',
      'array.min': 'At least one recipient is required',
      'any.required': 'Recipients are required'
    }),
  
  subject: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Subject cannot be empty',
      'string.max': 'Subject cannot exceed 200 characters',
      'any.required': 'Subject is required'
    }),
  
  text: Joi.string()
    .allow('')
    .optional(),
  
  html: Joi.string()
    .allow('')
    .optional(),
  
  from: Joi.string()
    .email()
    .optional(),
  
  cc: Joi.array()
    .items(Joi.string().email())
    .optional(),
  
  bcc: Joi.array()
    .items(Joi.string().email())
    .optional(),
  
  attachments: Joi.array()
    .items(Joi.object({
      filename: Joi.string().required(),
      content: Joi.alternatives().try(
        Joi.string(),
        Joi.binary()
      ).required(),
      contentType: Joi.string().optional(),
      encoding: Joi.string().optional()
    }))
    .optional()
}).custom((value, helpers) => {
  // At least one of text or html must be provided
  if (!value.text && !value.html) {
    return helpers.error('custom.textOrHtml');
  }
  return value;
}).messages({
  'custom.textOrHtml': 'Either text or html content must be provided'
});

const validateEmailRequest = (req, res, next) => {
  const { error, value } = emailValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }

  req.body = value;
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.message.includes('Email sending failed')) {
    statusCode = 503;
    message = 'Email service unavailable';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
};

module.exports = {
  validateEmailRequest,
  errorHandler,
  notFoundHandler
};