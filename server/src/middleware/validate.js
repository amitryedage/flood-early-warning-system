const { z } = require('zod');

// Middleware factory for validation
const validate = (schema) => (req, res, next) => {
    try {
        // Validate request body, query, or params against the schema
        // We assume the schema validates the whole 'body' or 'query' object

        // If schema is designed for body:
        if (req.body && Object.keys(req.body).length > 0) {
            req.body = schema.parse(req.body);
        }

        // Note: In a real app we might pass 'source' (body/query) to the factory 
        // to know what to validate. For this demo, we'll validate body if present.

        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input data',
                errors: err.errors
            });
        }
        next(err);
    }
};

module.exports = validate;
