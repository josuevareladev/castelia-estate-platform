import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const searchProperties = async (prompt) => {
    const response = await axios.post(`${API_URL}/agent/search`, { prompt });
    return response.data;
};