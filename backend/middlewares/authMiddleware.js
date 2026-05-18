import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token mathematically
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user and attach to request object, excluding the password field
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                const error = new Error('User attached to this token no longer exists');
                error.statusCode = 401;
                throw error;
            }

            next();
        } catch (error) {
            const err = new Error('Not authorized, token failed or expired');
            err.statusCode = 401;
            next(err);
        }
    } else {
        const error = new Error('Not authorized, no token provided');
        error.statusCode = 401;
        next(error);
    }
};