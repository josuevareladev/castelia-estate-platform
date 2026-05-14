// backend/routes/agentRoutes.js
import express from 'express';
import { processAgentQuery } from '../controllers/agentController.js';

const router = express.Router();

// Ruta: POST /api/agent/search
// Usamos POST porque enviaremos un 'body' con el texto largo del usuario
router.post('/search', processAgentQuery);

export default router;