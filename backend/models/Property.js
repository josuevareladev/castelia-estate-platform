const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Establece la relación directa con la colección de Usuarios
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String 
    }, // Almacena la URL generada por Cloudinary
    features: {
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        sqft: { type: Number }
    },
    status: { 
        type: String, 
        default: 'available' 
    }
}, { 
    timestamps: true // Crea automáticamente campos 'createdAt' y 'updatedAt'
});

module.exports = mongoose.model('Property', propertySchema);