const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Add a subscriber to a flight
router.post('/:flightId/subscribe', subscriptionController.addSubscriber);

// Get all subscribers for a flight
router.get('/:flightId', subscriptionController.getSubscribers);

module.exports = router;
