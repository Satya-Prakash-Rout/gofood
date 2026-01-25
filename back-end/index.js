// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require('./db');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// Import middleware
const { errorHandler, notFoundHandler, requestLogger } = require('./middleware/errorHandler');
const { apiLimiter, loginLimiter, sanitizeData, getCorsOptions, securityHeaders } = require('./middleware/security');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = socketIO(server, {
  cors: getCorsOptions()
});

// Make io accessible to routes
app.io = io;

// Connect to MongoDB
mongoDB();

// Apply CORS
app.use(cors(getCorsOptions()));

// Apply security headers
app.use(securityHeaders);

// Request logging
app.use(requestLogger);

// Middleware to parse JSON and form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(sanitizeData);

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Routes
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/LoginUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));
app.use('/api', require('./Routes/AddFood'));
app.use('/api', require('./Routes/AdminAuth'));
app.use('/api', require('./Routes/AdminOrders'));

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to GoFood API',
    version: '1.0.0',
    endpoints: '/api/*'
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start Server using HTTP server instead of Express
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Socket.IO server ready for connections`);
});
