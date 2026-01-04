const logger = require('../utils/logger');

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error using our unified logger
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
        stack: err.stack
    });

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // Only include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
