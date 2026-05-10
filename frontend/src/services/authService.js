import api from './api';

// Authenticates admin and returns user data + token
export const loginAdmin = async (email, password) => {
  try {
    // Cambio crucial: Se ajustó la ruta a '/users/login' para coincidir con el backend
    const response = await api.post('/users/login', { email, password });
    
    // Save to local storage for persistence
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email
      }));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};