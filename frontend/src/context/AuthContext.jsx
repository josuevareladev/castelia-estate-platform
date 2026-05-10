import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Provides global authentication state and methods
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminData = localStorage.getItem('user');
        
        if (token && adminData) {
            try {
                // Intenta decodificar los datos del usuario
                const parsedUser = JSON.parse(adminData);
                setUser(parsedUser);
            } catch (error) {
                // Si la data está corrupta (ej. "undefined"), se auto-limpia
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    // Authenticates user and persists session
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // Clears session data and state
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};