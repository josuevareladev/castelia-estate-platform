import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    region: { 
        type: String, 
        required: true, 
        // Actualizamos el enum a inglés:
        enum: ['north', 'south', 'east', 'west', 'center'], 
        index: true 
    },
    features: { type: [String], default: [] },
    imageUrl: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg' }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);