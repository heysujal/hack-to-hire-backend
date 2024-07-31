const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Admin = require('../models/admin'); // Make sure you have an Admin model defined
const Flight = require('../models/flight');
const Subscription = require('../models/subscription'); // Make sure you have a Subscription model defined
const { getIo } = require('../config/socketConfig');

// Replace with your actual JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
 
// Configure your Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
    res.status(200).json({ token, isVerified: true, message: "User Verified" });
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
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update flight by ID
exports.updateFlightById = async (req, res) => {
  const updates = req.body;
  let didUpdate = false;
  try {
    const flight = await Flight.findOne({ flight_id: req.params.id });
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
    didUpdate = true;
    // Notify subscribers after updating the flight
    const subscription = await Subscription.findOne({ flightId: flight.flight_id });
    if (subscription) {
      const { subscribers } = subscription;


      const message = `
        Update on Flight ${flight.flight_id}:
        Airline: ${flight.airline}
        Status: ${flight.status}
        From: ${flight.from}
        To: ${flight.to}
        Scheduled Departure: ${new Date(flight.scheduled_departure).toUTCString()}
        Scheduled Arrival: ${new Date(flight.scheduled_arrival).toUTCString()}
        Actual Departure: ${flight.actual_departure ? new Date(flight.actual_departure).toUTCString() : 'N/A'}
        Actual Arrival: ${flight.actual_arrival ? new Date(flight.actual_arrival).toUTCString() : 'N/A'}
        Departure Gate: ${flight.departure_gate}
        Arrival Gate: ${flight.arrival_gate}
      `;

      // Senting notification through Socket.io
      try{
        const io = getIo();
        io.emit('flightDetailsUpdate', flight);
      }catch(err){
        console.log(err)
      }

      // Send notifications to all subscribers
      for (const subscriber of subscribers) {
        console.log(subscriber)
        const { contactInfo, notificationMethod } = subscriber;

        if (notificationMethod === 'email') {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: contactInfo,
            subject: `Update on Flight ${flight.flight_id}`,
            text: `Dear Subscriber, the details of your flight ${flight.flight_id} have been updated. Please check the updated details in the flight tracker app.\n\n${message}`,
          });
        } else if (notificationMethod === 'phone') {
            console.log(contactInfo)
          await twilioClient.messages.create({
            body: `Update on Flight ${flight.flight_id}: The details have been updated. Check the flight tracker app for more information.\n\n${message}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: '+' + contactInfo,
          });
        }
      }
    }

    res.status(200).json(flight);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: didUpdate ? "Update Successful but could not send alert to subscribers" : 'Internal server error' });
  }
};
