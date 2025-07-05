const express = require('express');
const app = express();
const port = 5000;
const mongoDB = require('./db');


// Connect to MongoDB
mongoDB();

const cors = require('cors');
app.use(cors());




const corsOptions = {
  origin: 'http://localhost:3000', // ✅ match your React app's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));




// Middleware to parse JSON
app.use(express.json()); //This line tells your Express app to automatically parse incoming JSON request bodies and make them available on req.body

// Routes
app.use('/api', require('./Routes/CreateUser'));  //  app.use('/api/', ...): Tells Express to use the routes defined in CreateUser.js whenever a request starts with /api/.


app.use('/api', require('./Routes/LoginUser')); //for login

// Root Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
