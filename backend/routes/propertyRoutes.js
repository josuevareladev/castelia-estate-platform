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

// General Routes: Get All and Protected Create with Multer
router.route('/')
    .get(getProperties)
    .post(protect, upload.array('images', 5), createProperty);

// Specific ID Routes: Get Details, Protected Update, and Protected Delete
router.route('/:id')
    .get(getPropertyById)
    .put(protect, upload.array('images', 5), updateProperty)
    .delete(protect, deleteProperty);

export default router;