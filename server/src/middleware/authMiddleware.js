const supabase = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Middleware: Verify Supabase JWT from Authorization Header
 */
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication token required'
        });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(403).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
        }

        req.user = user;
        next();
    } catch (err) {
        logger.error(`❌ Auth: Middleware error: ${err.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error during authentication'
        });
    }
};

/**
 * Middleware: Role Check (Requires user to be admin)
 * Note: This assumes admin info is stored in user metadata or a 'users' table.
 * For now, we'll check if email matches a specific admin email or has admin metadata.
 */
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const userRole = req.user.user_metadata?.role || 'public';

        if (role !== userRole && userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: `Forbidden: Requires ${role} role`
            });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole
};
