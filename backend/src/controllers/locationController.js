const User = require('../models/User');
const Driver = require('../models/Driver');
const Shelter = require('../models/Shelter');
const { geocodeAddress, getRealDirections, searchAddress, reverseGeocode } = require('../services/mapService');
const { emitRescueEvent } = require('../services/socketService');

// @desc    Search addresses / places with autocomplete
// @route   GET /api/locations/search?q=query
exports.search = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const { lat, lon, lng } = req.query;
    const results = await searchAddress(query, lat, lon || lng);
    res.json({
      success: true,
      results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reverse geocode coordinates to text address
// @route   POST /api/locations/reverse
exports.reverse = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude required' });
    }
    const address = await reverseGeocode(latitude, longitude);
    res.json({
      success: true,
      address
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Geocode text address to coordinates
// @route   POST /api/locations/geocode
exports.geocode = async (req, res, next) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ success: false, message: 'Please provide an address' });
    }

    const result = await geocodeAddress(address);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get real turn-by-turn road route & ETA
// @route   POST /api/locations/directions
exports.getDirections = async (req, res, next) => {
  try {
    const { origin, destination } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: 'Please provide origin and destination coordinates' });
    }

    const route = await getRealDirections(origin, destination);
    res.json({
      success: true,
      route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user device location
// @route   PATCH /api/users/location
// @access  Private
exports.updateUserLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, accuracy, address } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide latitude and longitude' });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.location = {
      type: 'Point',
      coordinates: [lng, lat],
      address: address || user.location?.address || 'Current Device Location',
      accuracy: accuracy || 10,
      timestamp: new Date()
    };
    await user.save();

    // If driver, sync driver model coordinates and broadcast location to active rescue room
    if (user.role === 'DRIVER') {
      const driver = await Driver.findOne({ userId: user._id });
      if (driver) {
        driver.location = {
          type: 'Point',
          coordinates: [lng, lat],
          accuracy: accuracy || 10,
          updatedAt: new Date()
        };
        await driver.save();

        if (driver.activeDonationId) {
          emitRescueEvent('driver:location_updated', {
            driverId: driver._id,
            donationId: driver.activeDonationId,
            coordinates: [lng, lat],
            accuracy,
            timestamp: new Date().toISOString()
          }, { rescueId: driver.activeDonationId.toString() });
        }
      }
    }

    res.json({
      success: true,
      location: user.location
    });
  } catch (error) {
    next(error);
  }
};
