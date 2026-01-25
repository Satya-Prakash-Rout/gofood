// middleware/errorHandler.js
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Logger function
const logger = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  const logFile = path.join(logsDir, 'app.log');
  fs.appendFileSync(logFile, logMessage);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(logMessage);
  }
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  logger(`[${errorId}] ${err.message}`, 'error');
  
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errorId: errorId,
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      errorId: errorId
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      errorId: errorId
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      errorId: errorId
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Server error. Please try again later.'
    : err.message;

  res.status(statusCode).json({
    success: false,
    message: message,
    errorId: errorId,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  logger(`Route not found: ${req.method} ${req.path}`, 'warn');
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
};

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    logger(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`, level);
  });
  
  next();
};

module.exports = {
  errorHandler,
  notFoundHandler,
  requestLogger,
  logger
};
