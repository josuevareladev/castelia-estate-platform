const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); 

// Rutas generales: Ver todas y Crear
router.route('/')
    .get(propertyController.getProperties)
    .post(protect, upload.single('image'), propertyController.createProperty);

// Rutas específicas por ID: Ver detalle, Actualizar y Eliminar
router.route('/:id')
    .get(propertyController.getPropertyById)
    .put(protect, upload.single('image'), propertyController.updateProperty)
    .delete(protect, propertyController.deleteProperty);

module.exports = router;