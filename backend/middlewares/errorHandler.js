export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

    // 1. Mongoose Bad ObjectId (CastError)
    if (err.name === 'CastError') {
        const message = `Resource not found with ID of ${err.value}`;
        error = new Error(message);
        statusCode = 404;
    }

    // 2. Mongoose Duplicate Key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered in database';
        error = new Error(message);
        statusCode = 400;
    }

    // 3. Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new Error(message);
        statusCode = 400;
    }

    // 4. Standardized Output
    res.status(statusCode).json({
        success: false,
        error: error.message || 'Critical Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};