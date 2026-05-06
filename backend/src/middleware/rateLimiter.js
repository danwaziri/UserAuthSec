const rateLimit = require('express-rate-limit');

/**
 * General API Rate Limiter
 * Limits requests from a single IP to 100 per 15 minutes
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Auth-specific Rate Limiter (Stricter)
 * Limits login/register attempts to 5 per 15 minutes per IP
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Increased slightly for testing convenience
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { apiLimiter, authLimiter };
