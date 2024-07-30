const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); // Make sure you have an Admin model defined
const Flight = require('../models/flight')
// Replace with your actual JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, isVerified: true, message : "User Verified" });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get flight by ID
exports.getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findOne({ flight_id: req.params.id });
        if (!flight) {
          return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json(flight);
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
      }
  };
  
  // Update flight by ID
  exports.updateFlightById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const flight = await Flight.findById(id);
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
  
      // Update only the fields that are provided in the request
      Object.keys(updates).forEach(key => {
        if (flight[key] !== undefined) {
          flight[key] = updates[key];
        }
      });
  
      await flight.save();
      res.status(200).json(flight);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  