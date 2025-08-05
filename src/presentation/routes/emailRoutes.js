const express = require('express');
const EmailController = require('../controllers/EmailController');
const { validateEmailRequest } = require('../middleware/validation');

const router = express.Router();
const emailController = new EmailController();

/**
 * @swagger
 * components:
 *   schemas:
 *     EmailRequest:
 *       type: object
 *       required:
 *         - to
 *         - subject
 *       properties:
 *         to:
 *           type: array
 *           items:
 *             type: string
 *             format: email
 *           description: Array of recipient email addresses
 *           example: ["recipient@example.com", "another@example.com"]
 *         subject:
 *           type: string
 *           maxLength: 200
 *           description: Email subject line
 *           example: "Test Email Subject"
 *         text:
 *           type: string
 *           description: Plain text content of the email
 *           example: "This is the plain text content of the email."
 *         html:
 *           type: string
 *           description: HTML content of the email
 *           example: "<h1>Hello</h1><p>This is HTML content.</p>"
 *         from:
 *           type: string
 *           format: email
 *           description: Sender email address (optional, uses default if not provided)
 *           example: "sender@example.com"
 *         cc:
 *           type: array
 *           items:
 *             type: string
 *             format: email
 *           description: Array of CC email addresses
 *           example: ["cc1@example.com", "cc2@example.com"]
 *         bcc:
 *           type: array
 *           items:
 *             type: string
 *             format: email
 *           description: Array of BCC email addresses
 *           example: ["bcc1@example.com", "bcc2@example.com"]
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 example: "document.pdf"
 *               content:
 *                 type: string
 *                 description: Base64 encoded file content or file path
 *               contentType:
 *                 type: string
 *                 example: "application/pdf"
 *           description: Array of email attachments
 *     
 *     EmailResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Email sent successfully"
 *         data:
 *           type: object
 *           properties:
 *             messageId:
 *               type: string
 *               example: "<message-id@example.com>"
 *             to:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["recipient@example.com"]
 *             subject:
 *               type: string
 *               example: "Test Email Subject"
 *             sentAt:
 *               type: string
 *               format: date-time
 *               example: "2023-12-01T10:30:00.000Z"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         error:
 *           type: string
 *           example: "Recipients are required"
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Recipients are required", "Subject is required"]
 */

/**
 * @swagger
 * /api/v1/email/send:
 *   post:
 *     summary: Send an email
 *     description: Send an email to one or more recipients with optional CC, BCC, and attachments
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *           examples:
 *             simple:
 *               summary: Simple email
 *               value:
 *                 to: ["recipient@example.com"]
 *                 subject: "Hello World"
 *                 text: "This is a simple email message."
 *             html:
 *               summary: HTML email
 *               value:
 *                 to: ["recipient@example.com"]
 *                 subject: "HTML Email"
 *                 html: "<h1>Hello</h1><p>This is an <strong>HTML</strong> email.</p>"
 *             complete:
 *               summary: Complete email with all options
 *               value:
 *                 to: ["recipient@example.com"]
 *                 cc: ["cc@example.com"]
 *                 bcc: ["bcc@example.com"]
 *                 subject: "Complete Email Example"
 *                 text: "Plain text content"
 *                 html: "<h1>HTML Content</h1><p>This email has both text and HTML.</p>"
 *                 from: "custom-sender@example.com"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       503:
 *         description: Email service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/send', validateEmailRequest, (req, res) => {
  emailController.sendEmail(req, res);
});

/**
 * @swagger
 * /api/v1/email/test:
 *   get:
 *     summary: Test email service connection
 *     description: Test the connection to the email service provider
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Email service connection is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email service connection is working"
 *       503:
 *         description: Email service connection failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/test', (req, res) => {
  emailController.testConnection(req, res);
});

/**
 * @swagger
 * /api/v1/email/health:
 *   get:
 *     summary: Health check
 *     description: Check if the email service is running
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email service is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-01T10:30:00.000Z"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get('/health', (req, res) => {
  emailController.getHealthCheck(req, res);
});

module.exports = router;