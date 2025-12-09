// index.js
const express = require('express');
const app = express();
const port = 5000;
const mongoDB = require('./db');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.io = io;

// Connect to MongoDB
mongoDB();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', require('./Routes/CreateUser'));//app.use('/api/', ...): Tells Express to use the routes defined in CreateUser.js whenever a request starts with /api/.

app.use('/api', require('./Routes/LoginUser')); //for login

app.use('/api', require('./Routes/DisplayData')); // display data

app.use('/api', require('./Routes/OrderData'));

app.use('/api', require('./Routes/AddFood')); // add food items

app.use('/api', require('./Routes/AdminAuth')); // admin authentication

app.use('/api', require('./Routes/AdminOrders')); // admin orders with location data


// Root Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  console.warn('Route not found:', req.method, req.path);
  res.status(404).json({ error: 'Route not found' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server using HTTP server instead of Express
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Socket.IO server ready for connections`);
});
