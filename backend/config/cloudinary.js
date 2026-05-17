import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Validación estricta de variables de entorno (Fail Fast)
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary Config Error: Missing Cloudinary credentials in .env');
}

// Inicialización del SDK
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración del motor de almacenamiento
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'castelia_properties', // Carpeta dedicada en tu nube
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, crop: 'limit' }] // Optimización de peso automática
    }
});

// Exportamos el middleware configurado con límite de seguridad de 5MB
export const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});