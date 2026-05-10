const Property = require('../models/Property');
const cloudinary = require('cloudinary').v2;

// Crear nueva propiedad con imagen
const createProperty = async (req, res) => {
    try {
        const propertyData = req.body;
        propertyData.admin = req.user._id; 

        if (req.file) {
            propertyData.image = req.file.path;
        }

        const newProperty = new Property(propertyData);
        const savedProperty = await newProperty.save();
        
        res.status(201).json(savedProperty);
    } catch (error) {
        console.error('Falla Crítica al crear propiedad:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Obtener todas las propiedades
const getProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener detalle de una sola propiedad
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Propiedad no encontrada' });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar propiedad (incluyendo posible cambio de imagen)
const updateProperty = async (req, res) => {
    try {
        const updateData = req.body;

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ message: 'Propiedad no encontrada' });
        }

        res.status(200).json(updatedProperty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar propiedad y su imagen en Cloudinary
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({ message: 'Propiedad no encontrada' });
        }

        // Lógica para borrar la imagen de la nube antes de borrar el registro
        if (property.image && property.image.includes('cloudinary')) {
            const urlParts = property.image.split('/');
            const filenameWithExt = urlParts[urlParts.length - 1]; 
            const folderName = urlParts[urlParts.length - 2]; 
            const publicId = filenameWithExt.split('.')[0]; 
            
            const fullPublicId = `${folderName}/${publicId}`;
            await cloudinary.uploader.destroy(fullPublicId);
        }

        await Property.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Propiedad e imagen eliminadas correctamente' });
    } catch (error) {
        console.error('Error Crítico al eliminar propiedad:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar la eliminación.' });
    }
};

module.exports = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};