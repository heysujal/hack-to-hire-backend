const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/mongodbConfig')
const cors = require('cors')
const app = express();
dotenv.config();

app.use(cors())
// Middleware
app.use(bodyParser.json());

// Import Routes
const flightRoutes = require('./routes/flightRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes')
const adminRoutes = require('./routes/adminRoutes')
// Route Middlewares
app.use('/api/flights', flightRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes)

// Connect to MongoDB
// mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
