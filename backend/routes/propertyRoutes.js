import express from 'express';
import { 
    getProperties, 
    createProperty, 
    getPropertyById, 
    updateProperty, 
    deleteProperty 
} from '../controllers/propertyController.js';
import { protect } from '../middlewares/authMiddleware.js'; 
import { upload } from '../config/cloudinary.js'; 

const router = express.Router();

// Rutas generales: Ver todas y Crear
router.route('/')
    .get(getProperties)
    .post(protect, upload.single('image'), createProperty);

// Rutas específicas por ID: Ver detalle, Actualizar y Eliminar
router.route('/:id')
    .get(getPropertyById)
    .put(protect, upload.single('image'), updateProperty)
    .delete(protect, deleteProperty);

export default router;