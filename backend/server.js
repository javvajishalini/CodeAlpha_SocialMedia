require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { app, server } = require('./socket/socket');

// Load env vars
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.send('Connectify API is running');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/connectify')
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server using the HTTP server instead of Express directly
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('MongoDB connection error:', err));
