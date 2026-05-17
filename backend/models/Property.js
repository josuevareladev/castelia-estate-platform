import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    region: { 
        type: String, 
        required: true, 
        enum: ['north', 'south', 'east', 'west', 'center'], 
        index: true 
    },
    features: { type: [String], default: [] },
    images: { type: [String], required: true, default: [] } 
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);