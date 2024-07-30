const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Subscribe to notifications
router.post('/subscribe', async (req, res) => {
  const { userId, notificationMethod, contactInfo, flightId } = req.body;

  try {
    const notification = new Notification({ userId, notificationMethod, contactInfo, flightId });
    await notification.save();
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notify users
router.post('/notify', async (req, res) => {
  const { flightId, status } = req.body;

  try {
    const notifications = await Notification.find({ flightId });

    notifications.forEach(notification => {
      if (notification.notificationMethod === 'email') {
        // Implement email sending 
        // e.g., nodemailer


        const sendEmail = async (to, subject, text) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: '"Flight Tracker" <your-email@gmail.com>',
            to,
            subject,
            text
        });

        console.log('Message sent: %s', info.messageId);
        };

      } else if (notification.notificationMethod === 'phone') {
        // Implement SMS sending
        // e.g., twilio
      } else if (notification.notificationMethod === 'app') {
        // Implement app notification
      }
    });

    res.status(200).json({ message: 'Notifications sent!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
