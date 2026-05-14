import axios from 'axios';

const API_URL = 'http://localhost:5000/api/agent';

/**
 * Llama al Agente de IA para procesar el prompt y obtener propiedades.
 */
export const searchProperties = async (prompt) => {
    try {
        const response = await axios.post(`${API_URL}/search`, { prompt });
        return response.data; // { success: true, data: [...], filters: {...} }
    } catch (error) {
        console.error('Error en la búsqueda:', error.response?.data?.error || error.message);
        return {
            success: false,
            data: [],
            error: error.message
        };
    }
};