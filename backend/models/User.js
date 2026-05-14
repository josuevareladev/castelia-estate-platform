import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'] 
    },
    email: { 
        type: String, 
        required: [true, 'El correo electrónico es obligatorio'], 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: [true, 'La contraseña es obligatoria'] 
    },
}, { 
    timestamps: true 
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Comparar contraseñas para el Login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);