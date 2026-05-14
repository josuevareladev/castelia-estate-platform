import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Obligatorio usar la extensión .js en módulos locales

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del encabezado
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Agregar el usuario a la petición (menos la contraseña)
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            // Delegamos el error al errorHandler global
            const err = new Error('No autorizado, token fallido o expirado');
            err.statusCode = 401;
            return next(err);
        }
    }

    if (!token) {
        const err = new Error('No autorizado, no se proporcionó un token');
        err.statusCode = 401;
        return next(err);
    }
};