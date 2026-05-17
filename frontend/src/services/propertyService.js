import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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