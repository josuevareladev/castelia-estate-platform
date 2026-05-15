import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import mongoose from 'mongoose'; 
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler } from './middlewares/errorHandler.js'; 
import agentRoutes from './routes/agentRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// 1. Robust CORS Policy
const allowedOrigins = [
    'https://castelia-estate-platform.vercel.app', // Production Frontend
    'http://localhost:5173'                        // Local Frontend
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Security & Parsing Middlewares
app.use(express.json());
app.use(mongoSanitize());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB: Connection established successfully'))
  .catch((err) => console.error('❌ MongoDB: Critical connection error ->', err.message));

// API Routing
app.use('/api/properties', propertyRoutes);
app.use('/api/agent', agentRoutes);

// 2. Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200).json({ success: true, status: 'Castelia API is active' });
});

// 3. Fallback 404 Handler (Crucial to prevent HTML responses from breaking Axios)
app.use('*', (req, res) => {
    res.status(404).json({ success: false, error: 'API Endpoint not found' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Castelia Server running on port: ${PORT}`);
  console.log('🤖 AI Agent Check:', process.env.GEMINI_API_KEY ? 'KEY PRESENT' : 'KEY MISSING');
});