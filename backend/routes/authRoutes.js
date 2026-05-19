import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Strict Rate Limiting for Login (Prevents Brute Force Attacks)
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: { 
        success: false, 
        error: 'Too many login attempts from this IP, please try again after 10 minutes' 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// We keep registration open (or you can limit it if you want to prevent spam accounts)
router.post('/register', registerUser);

// Apply strict limiter only to the login route
router.post('/login', loginLimiter, loginUser);

export default router;