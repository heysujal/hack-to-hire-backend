const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


 
// Define routes for signup and login
router.post('/signup', adminController.signup);
router.post('/login', adminController.login);

// Define routes for flight management
router.get('/flights/:id', adminController.getFlightById);
router.put('/flights/:id', adminController.updateFlightById);

module.exports = router;
