import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import mongoose from 'mongoose'; 
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

// Importación de rutas y middlewares
import { errorHandler } from './middlewares/errorHandler.js'; 
import agentRoutes from './routes/agentRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Forzamos la carga del .env desde la ruta absoluta
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middlewares de seguridad y base
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB: Conexión establecida'))
  .catch((err) => console.error('❌ MongoDB: Error crítico ->', err.message));

// Montaje de API
app.use('/api/properties', propertyRoutes);
app.use('/api/agent', agentRoutes);

// Manejador de errores global
app.use(errorHandler);

// El puerto puede ser cualquiera, el 5000 es solo el estándar de la industria
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Castelia listo en puerto: ${PORT}`);
  console.log('🤖 Verificando IA:', process.env.GEMINI_API_KEY ? 'LLAVE PRESENTE' : 'FALTA LLAVE');
});