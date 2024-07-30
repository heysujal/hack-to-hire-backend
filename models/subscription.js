const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  contactInfo: {
    type: String,
    required: true
  },
  notificationMethod: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  }
});
 
const subscriptionSchema = new mongoose.Schema({
  flightId: {
    type: String,
    required: true,
    unique: true
  },
  subscribers: [subscriberSchema]
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
