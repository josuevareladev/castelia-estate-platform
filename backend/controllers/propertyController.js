import Property from '../models/Property.js';
import { v2 as cloudinary } from 'cloudinary';

// Create a new property with multiple images
export const createProperty = async (req, res, next) => {
    try {
        const propertyData = req.body;
        // Temporarily bypassed for development: propertyData.admin = req.user._id;

        if (!req.files || req.files.length === 0) {
            const error = new Error('At least one image is required for the property.');
            error.statusCode = 400;
            throw error;
        }

        propertyData.images = req.files.map(file => file.path);

        const newProperty = new Property(propertyData);
        const savedProperty = await newProperty.save();
        
        res.status(201).json({
            success: true,
            data: savedProperty
        });
    } catch (error) {
        next(error); 
    }
};

// Get all properties
export const getProperties = async (req, res, next) => {
    try {
        const { minPrice, maxPrice, regionId, page = 1, limit = 10 } = req.query;
        const query = {}; 

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (regionId) {
            query.regionId = regionId;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const properties = await Property.find(query)
            .skip(skip)
            .limit(Number(limit))
            .lean(); 

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

// Get single property details
export const getPropertyById = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            const error = new Error('Property not found');
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

// Update property
export const updateProperty = async (req, res, next) => {
    try {
        const updateData = req.body;

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path);
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProperty) {
            const error = new Error('Property not found');
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

// Delete property and its images from Cloudinary
export const deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        
        if (!property) {
            const error = new Error('Property not found');
            error.statusCode = 404;
            throw error;
        }

        if (property.images && property.images.length > 0) {
            const deletePromises = property.images.map(imageUrl => {
                if (imageUrl.includes('cloudinary')) {
                    const urlParts = imageUrl.split('/');
                    const filenameWithExt = urlParts[urlParts.length - 1]; 
                    const folderName = urlParts[urlParts.length - 2]; 
                    const publicId = filenameWithExt.split('.')[0]; 
                    
                    const fullPublicId = `${folderName}/${publicId}`;
                    return cloudinary.uploader.destroy(fullPublicId);
                }
                return Promise.resolve();
            });
            
            await Promise.all(deletePromises);
        }

        await Property.findByIdAndDelete(req.params.id);

        res.status(200).json({ 
            success: true, 
            message: 'Property and images deleted successfully' 
        });
    } catch (error) {
        next(error);
    }
};