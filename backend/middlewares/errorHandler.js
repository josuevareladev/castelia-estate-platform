export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    // La pila de errores (stack) solo se expone en desarrollo para depuración
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};