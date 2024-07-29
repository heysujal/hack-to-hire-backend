
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB'))
      
    } catch (err) {
        console.error('Could not connect to MongoDB...', err);
        process.exit(1);
    }
};

module.exports = connectDB;