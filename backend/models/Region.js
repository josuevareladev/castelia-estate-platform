import mongoose from 'mongoose';

const regionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la región es obligatorio'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: 'Sin descripción detallada'
    }
}, {
    timestamps: true
});

export default mongoose.model('Region', regionSchema);