// middleware/security.js
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');

// Rate limiting middleware
const createRateLimiter = (windowMs = 900000, maxRequests = 100) => {
  return rateLimit({
    windowMs: windowMs,
    max: maxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health check
      return req.path === '/health';
    }
  });
};

// Login rate limiter (stricter)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true,
  skipFailedRequests: false
});

// API rate limiter
const apiLimiter = createRateLimiter(900000, 100); // 100 requests per 15 minutes

// Data sanitization middleware
const sanitizeData = (req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }
  if (req.params) {
    req.params = mongoSanitize(req.params);
  }
  if (req.query) {
    req.query = mongoSanitize(req.query);
  }
  next();
};

// CORS configuration
const getCorsOptions = () => {
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  
  return {
    origin: corsOrigin.split(',').map(url => url.trim()),
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
  };
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Disable client-side caching for sensitive data
  if (req.path.includes('/api/admin') || req.path.includes('/login')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

module.exports = {
  apiLimiter,
  loginLimiter,
  sanitizeData,
  getCorsOptions,
  securityHeaders,
  createRateLimiter
};
