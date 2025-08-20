// Custom error class
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error details:', {
        name: err.name,
        code: err.code,
        message: err.message,
        stack: err.stack
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            messages: errors,
            details: process.env.NODE_ENV === 'development' ? err.errors : undefined
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            error: 'Duplicate Field Value',
            message: `The ${field} is already taken`,
            field: field
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Authentication Error',
            message: 'Invalid authentication token',
            action: 'Please log in again'
        });
    }

    // JWT expired error
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Authentication Error',
            message: 'Your session has expired',
            action: 'Please log in again'
        });
    }

    // Cast error (invalid MongoDB ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'Invalid Parameter',
            message: `Invalid ${err.path}: ${err.value}`,
            field: err.path
        });
    }

    // Default error response
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                details: err
            })
        }
    });
};

module.exports = { errorHandler, ErrorResponse };
