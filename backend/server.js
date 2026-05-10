require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const propertyRoutes = require('./routes/propertyRoutes'); 
const userRoutes = require('./routes/userRoutes');

const app = express();
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/api/status', (req, res) => {
    res.json({ message: 'PropTech API funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});