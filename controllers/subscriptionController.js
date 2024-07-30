const Subscription = require('../models/subscription');

// Add a subscriber to a flight 
exports.addSubscriber = async (req, res) => {
    const { flightId } = req.params;
    const { contactInfo, notificationMethod } = req.body;

    if (!contactInfo || !notificationMethod) {
        return res.status(400).json({ message: 'Contact info and notification method are required' });
    }

    try {
        // Find the existing subscription by flightId
        let subscription = await Subscription.findOne({ flightId });

        if (!subscription) {
            // Create a new subscription if it doesn't exist
            subscription = new Subscription({
                flightId,
                subscribers: [{ contactInfo, notificationMethod }]
            });
        } else {
            // Check for duplicate subscribers based on contact info and notification method
            const existingSubscriber = subscription.subscribers.find(sub =>
                sub.contactInfo === contactInfo && sub.notificationMethod === notificationMethod
            );

            if (existingSubscriber) {
                return res.status(400).json({ message: 'Subscriber already exists for this flight' });
            }

            // For phone numbers, ensure uniqueness within the flight subscribers
            if (notificationMethod === 'phone') {
                const phoneExists = subscription.subscribers.some((sub) => {
                    console.log(sub);
                    return sub.contactInfo == contactInfo && sub.notificationMethod === 'phone'
                }
                );
                if (phoneExists) {
                    return res.status(400).json({ message: 'Phone number already subscribed for this flight' });
                }
            }

            // Add new subscriber
            subscription.subscribers.push({ contactInfo, notificationMethod });
        }

        await subscription.save();
        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all subscribers for a flight
exports.getSubscribers = async (req, res) => {
    const { flightId } = req.params;

    try {
        const subscription = await Subscription.findOne({ flightId });
        if (!subscription) {
            return res.status(404).json({ message: 'No subscribers found for this flight' });
        }
        res.json(subscription.subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
