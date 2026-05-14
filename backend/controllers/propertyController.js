import Property from '../models/Property.js';
import { v2 as cloudinary } from 'cloudinary';

// Crear nueva propiedad con imagen
export const createProperty = async (req, res, next) => {
    try {
        const propertyData = req.body;
        // Asumiendo que req.user viene del authMiddleware
        propertyData.admin = req.user._id; 

        if (req.file) {
            propertyData.image = req.file.path;
        }

        const newProperty = new Property(propertyData);
        const savedProperty = await newProperty.save();
        
        res.status(201).json({
            success: true,
            data: savedProperty
        });
    } catch (error) {
        next(error); // Pasamos el error al manejador global
    }
};

// Obtener todas las propiedades (Optimizada con Paginación y Filtros para la IA)
export const getProperties = async (req, res, next) => {
    try {
        const { minPrice, maxPrice, regionId, page = 1, limit = 10 } = req.query;
        const query = {}; 

        // Filtrado por precio para el Agente AI
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filtrado por región
        if (regionId) {
            query.regionId = regionId;
        }

        const skip = (Number(page) - 1) * Number(limit);

        // Búsqueda optimizada (O(log n) si hay índices)
        const properties = await Property.find(query)
            .skip(skip)
            .limit(Number(limit))
            .lean(); // .lean() lo hace más rápido al devolver JSON puro

        const total = await Property.countDocuments(query);

        res.status(200).json({
            success: true,
            count: properties.length,
            meta: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            },
            data: properties
        });
    } catch (error) {
        next(error);
    }
};

// Obtener detalle de una sola propiedad
export const getPropertyById = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            // Creamos un error personalizado que el errorHandler atrapará
            const error = new Error('Propiedad no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            data: property
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar propiedad
export const updateProperty = async (req, res, next) => {
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
            const error = new Error('Propiedad no encontrada');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: updatedProperty
        });
    } catch (error) {
        next(error);
    }
};

// Eliminar propiedad y su imagen en Cloudinary
export const deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        
        if (!property) {
            const error = new Error('Propiedad no encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Lógica para borrar la imagen de la nube
        if (property.image && property.image.includes('cloudinary')) {
            const urlParts = property.image.split('/');
            const filenameWithExt = urlParts[urlParts.length - 1]; 
            const folderName = urlParts[urlParts.length - 2]; 
            const publicId = filenameWithExt.split('.')[0]; 
            
            const fullPublicId = `${folderName}/${publicId}`;
            await cloudinary.uploader.destroy(fullPublicId);
        }

        await Property.findByIdAndDelete(req.params.id);

        res.status(200).json({ 
            success: true, 
            message: 'Propiedad e imagen eliminadas correctamente' 
        });
    } catch (error) {
        next(error);
    }
};