// middleware/security.js

const rateLimit = require('express-rate-limit');

// ============================================================
// DATA SANITIZATION
// ============================================================

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Remove $ and . from keys to help prevent NoSQL injection
      const sanitizedKey = key.replace(/[\$\.]/g, '');

      sanitized[sanitizedKey] = sanitizeObject(obj[key]);
    }
  }

  return sanitized;
};

// ============================================================
// RATE LIMITING
// ============================================================

const createRateLimiter = (windowMs = 900000, maxRequests = 100) => {
  return rateLimit({
    windowMs,
    max: maxRequests,

    message: 'Too many requests from this IP, please try again later.',

    standardHeaders: true,
    legacyHeaders: false,

    skip: (req) => {
      // Don't rate-limit health checks
      return req.path === '/health';
    }
  });
};

// Stricter rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // Maximum 5 login attempts in 15 minutes
  max: 5,

  message: 'Too many login attempts, please try again after 15 minutes.',

  skipSuccessfulRequests: true,
  skipFailedRequests: false,

  standardHeaders: true,
  legacyHeaders: false
});

// General API rate limiter
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);

// ============================================================
// DATA SANITIZATION MIDDLEWARE
// ============================================================

const sanitizeData = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// ============================================================
// CORS CONFIGURATION
// ============================================================

const getCorsOptions = () => {
  const allowedOrigins = [
    // Local development
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',

    // Production Vercel domains
    'https://gofood-rose-pi.vercel.app',
    'https://gofood-git-main-satya-prakash-routs-projects.vercel.app',
    'https://gofood-92co85ieh-satya-prakash-routs-projects.vercel.app',
    'https://gofood-clqukmqac-satya-prakash-routs-projects.vercel.app'
  ];

  return {
    origin: (origin, callback) => {
      // Allow requests without an Origin header.
      // Useful for health checks and server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('CORS blocked origin:', origin);

      return callback(
        new Error(`CORS: Origin ${origin} not allowed`)
      );
    },

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ],

    credentials: true,

    // Cache preflight response for 24 hours
    maxAge: 86400
  };
};

// ============================================================
// SECURITY HEADERS
// ============================================================

const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS protection for older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Disable caching for sensitive endpoints
  if (
    req.path.includes('/api/admin') ||
    req.path.includes('/login')
  ) {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );

    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  apiLimiter,
  loginLimiter,
  sanitizeData,
  getCorsOptions,
  securityHeaders,
  createRateLimiter
};