const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

router.get('/', flightController.getAllFlights);
router.post('/', flightController.createFlight);
router.get('/search', flightController.searchFlights);
router.get('/:id', flightController.getFlightById);

module.exports = router;
