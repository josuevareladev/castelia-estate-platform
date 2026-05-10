import axios from 'axios';

// Esta línea detecta automáticamente si debe usar Vercel o tu PC
const API_URL = import.meta.env.VITE_API_URL || 'https://castelia-api.onrender.com';

export const getProperties = async () => {
    try {
        const response = await axios.get(`${API_URL}/properties`);
        return response.data;
    } catch (error) {
        console.error("Error en getProperties:", error);
        throw error;
    }
};

// Si tienes más funciones como createProperty o updateProperty, 
// asegúrate de que todas usen ${API_URL} en lugar de localhost.