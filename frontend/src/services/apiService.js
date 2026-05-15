// frontend/src/services/apiService.js
import axios from 'axios';

// Vite usa import.meta.env para las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/agent';

export const searchProperties = async (prompt) => {
    const response = await axios.post(`${API_URL}/search`, { prompt });
    return response.data;
};