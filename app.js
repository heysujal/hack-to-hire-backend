const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/mongodbConfig')

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Import Routes
const flightRoutes = require('./routes/flightRoutes');

// Route Middlewares
app.use('/api/flights', flightRoutes);

// Connect to MongoDB
// mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
