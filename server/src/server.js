const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Serve static files from the client directory in development
if (process.env.NODE_ENV === 'development') {
  app.use(express.static('../client'));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
// Enable other routes as they are implemented
// app.use('/api/news', require('./routes/news'));
// app.use('/api/events', require('./routes/events'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aihs')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
const errorHandler = require('./middleware/error');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
