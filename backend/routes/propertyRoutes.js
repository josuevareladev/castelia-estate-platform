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

// General Routes: Get All and Create
// Removed 'protect' from the POST route temporarily for development testing
router.route('/')
    .get(getProperties)
    .post(upload.array('images', 5), createProperty);

// Specific ID Routes: Get Details, Update, and Delete
router.route('/:id')
    .get(getPropertyById)
    .put(protect, upload.array('images', 5), updateProperty)
    .delete(protect, deleteProperty);

export default router;