const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http')
const connectDB = require('./config/mongodbConfig')
const {initSocketIo} = require('./config/socketConfig')
const cors = require('cors')
const app = express();
dotenv.config();

const server = http.createServer(app);

//Initialize Socket.io
initSocketIo(server);
app.use(cors())
// Middleware
app.use(bodyParser.json());

// Import Routes
const flightRoutes = require('./routes/flightRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes')
const adminRoutes = require('./routes/adminRoutes');
// Route Middlewares
app.use('/api/flights', flightRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes)

// Connect to MongoDB
connectDB();
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
