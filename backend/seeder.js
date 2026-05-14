import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Property from './models/Property.js';
import { mockProperties } from './data/properties.js';

// Configuración de rutas absolutas para garantizar la carga del .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Importa el catálogo controlado a MongoDB.
 * Limpia la colección existente para garantizar la idempotencia del script.
 */
const importData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI no está definida en las variables de entorno.');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conexión a MongoDB establecida para Seeding.');

        // Limpieza de datos previos para evitar duplicación
        await Property.deleteMany();
        console.log('🗑️  Colección de propiedades limpiada.');

        // Inserción en bloque (bulk insert) para optimizar rendimiento de red
        await Property.insertMany(mockProperties);
        console.log('📥 Catálogo inicial importado exitosamente.');

        process.exit(0); // Salida exitosa
    } catch (error) {
        console.error('❌ Error crítico durante el seeding:', error.message);
        process.exit(1); // Salida con código de error
    }
};

// Ejecutar la función
importData();