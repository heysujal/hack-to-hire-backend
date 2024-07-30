const Flight = require('../models/flight');

// Get all flights
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// for Admin Use
// Create a new flight
exports.createFlight = async (req, res) => {
  const flightData = {
    flight_id: req.body.flight_id,
    airline: req.body.airline,
    status: req.body.status,
    departure_gate: req.body.departure_gate,
    arrival_gate: req.body.arrival_gate,
    scheduled_departure: req.body.scheduled_departure,
    scheduled_arrival: req.body.scheduled_arrival,
    actual_departure: req.body.actual_departure,
    actual_arrival: req.body.actual_arrival,
    from: req.body.from,
    to: req.body.to
  }
  const flight = new Flight(flightData);

  try {
    const newFlight = await flight.save();
    res.status(201).json(newFlight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single flight
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



// Search flights
exports.searchFlights = async (req, res) => {
    const { from, to, date, flight_id } = req.query;
  
    // Convert the date to UTC
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setUTCHours(23, 59, 59, 999);
  
    // Build the search query
    let searchQuery = {
      from: from,
      to: to,
      scheduled_departure: {
        $gte: startDate,
        $lte: endDate
      }
    };
  
    if (flight_id) {
      searchQuery.flight_id = flight_id;
    }
  
    try {
      const flights = await Flight.find(searchQuery);
      res.json(flights);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };