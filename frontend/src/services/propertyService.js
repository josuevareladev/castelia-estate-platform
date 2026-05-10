import api from './api';

export const getProperties = async () => {
    const response = await api.get('/properties');
    return response.data;
};

// Nueva función para enviar la propiedad con imagen
export const createProperty = async (propertyData) => {
    // Usamos FormData para que el navegador maneje el archivo correctamente
    const response = await api.post('/properties', propertyData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};