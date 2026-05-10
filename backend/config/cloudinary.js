const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuración de credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del motor de almacenamiento
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prime-estate-properties', // Carpeta donde se guardarán en Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Formatos permitidos
  },
});

// Middleware de Multer listo para usarse en las rutas
// ... (resto del código de configuración de cloudinary)

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload }; // Exportación como objeto