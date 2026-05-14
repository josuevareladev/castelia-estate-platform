import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuración de credenciales (usando las variables de entorno ya configuradas)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del motor de almacenamiento
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'castelia-estate-properties', // Actualizado a la nomenclatura de Castelia
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], 
  },
});

// Middleware de Multer listo para usarse en las rutas
export const upload = multer({ storage });
export { cloudinary };