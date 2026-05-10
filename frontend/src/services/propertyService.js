import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://castelia-api.onrender.com';

// 1. Obtener todas las propiedades
export const getProperties = async () => {
    const response = await axios.get(`${API_URL}/properties`);
    return response.data;
};

// 2. Crear una nueva propiedad (ESTA ES LA QUE TE PIDE VERCEL)
export const createProperty = async (propertyData) => {
    const response = await axios.post(`${API_URL}/properties`, propertyData);
    return response.data;
};

// 3. Obtener una sola propiedad por ID
export const getPropertyById = async (id) => {
    const response = await axios.get(`${API_URL}/properties/${id}`);
    return response.data;
};

// 4. Actualizar/Editar una propiedad
export const updateProperty = async (id, propertyData) => {
    const response = await axios.put(`${API_URL}/properties/${id}`, propertyData);
    return response.data;
};

// 5. Eliminar una propiedad
export const deleteProperty = async (id) => {
    const response = await axios.delete(`${API_URL}/properties/${id}`);
    return response.data;
};