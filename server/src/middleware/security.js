const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate Limiter: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Setup function to apply middleware to app
const setupSecurity = (app) => {
    // Helmet: Secure HTTP headers
    app.use(helmet());

    // Apply global rate limiter to all requests
    app.use(apiLimiter);

    console.log('Security Middleware (Helmet + RateLimit) Applied');
};

module.exports = { setupSecurity, apiLimiter };
