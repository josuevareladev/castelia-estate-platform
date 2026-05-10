const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const adminEmail = 'admin@prime.com';
        let user = await User.findOne({ email: adminEmail });
        
        if (user) {
            // Si ya existe, forzamos la nueva contraseña
            user.password = 'password123';
            await user.save();
            console.log('✅ Contraseña actualizada para el usuario existente.');
        } else {
            // Si no existe, lo creamos de cero
            await User.create({
                name: 'Admin Prime',
                email: adminEmail,
                password: 'password123'
            });
            console.log('✅ Usuario administrador creado exitosamente.');
        }
        process.exit();
    })
    .catch((error) => {
        console.error('Error de conexión:', error);
        process.exit(1);
    });