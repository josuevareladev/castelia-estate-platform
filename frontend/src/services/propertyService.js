import axios from 'axios';
import { getAuthToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configura un interceptor para inyectar automáticamente el token en cada petición
axios.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getProperties = async () => {
    const response = await axios.get(`${API_URL}/properties`);
    return response.data;
};

export const createProperty = async (propertyData) => {
    const response = await axios.post(`${API_URL}/properties`, propertyData);
    return response.data;
};

export const getPropertyById = async (id) => {
    const response = await axios.get(`${API_URL}/properties/${id}`);
    return response.data;
};

export const updateProperty = async (id, propertyData) => {
    const response = await axios.put(`${API_URL}/properties/${id}`, propertyData);
    return response.data;
};

export const deleteProperty = async (id) => {
    const response = await axios.delete(`${API_URL}/properties/${id}`);
    return response.data;
};