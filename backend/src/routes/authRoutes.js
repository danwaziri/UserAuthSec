const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const { authLimiter } = require('../middleware/rateLimiter');
const { auth } = require('../middleware/auth');

// Apply strict rate limiting to auth routes
router.use(authLimiter);

// Validation rules for registration
const registerValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('full_name').notEmpty().withMessage('Full name is required')
];

// Validation rules for login
const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// POST /api/v1/auth/register
router.post('/register', registerValidation, authController.register);

// POST /api/v1/auth/login
router.post('/login', loginValidation, authController.login);

// POST /api/v1/auth/verify-mfa
router.post('/verify-mfa', authController.verifyMFA);

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// POST /api/v1/auth/logout
router.post('/logout', authController.logout);

// POST /api/v1/auth/logout-all
router.post('/logout-all', auth, authController.logoutAll);

// GET /api/v1/auth/history
router.get('/history', auth, authController.getHistory);

// POST /api/v1/auth/toggle-mfa
router.post('/toggle-mfa', auth, authController.toggleMFA);

module.exports = router;
