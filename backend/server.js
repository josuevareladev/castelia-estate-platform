require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const propertyRoutes = require('./routes/propertyRoutes'); 
const userRoutes = require('./routes/userRoutes');

const app = express();
connectDB();

// 1. Configuración de CORS profesional
app.use(cors({
    origin: '*', // Esto permite que Vercel entre sin problemas
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 2. Rutas simplificadas para coincidir con tu Frontend
app.use('/properties', propertyRoutes);
app.use('/users', userRoutes);

// Ruta de prueba (ahora disponible en /status)
app.get('/status', (req, res) => {
    res.json({ message: 'PropTech API funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});