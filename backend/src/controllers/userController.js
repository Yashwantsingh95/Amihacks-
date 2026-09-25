const User = require('../models/User');
const Driver = require('../models/Driver');
const { getIO } = require('../services/socketService');

// @desc    Update authenticated user's GPS location
// @route   PATCH /api/users/location
// @access  Private
exports.updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, accuracy, address } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    // Validate coordinates strictly
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude. Must be between -90 and 90'
      });
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid longitude. Must be between -180 and 180'
      });
    }

    // Authenticated user can ONLY update their own location
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const now = new Date();
    user.location = {
      type: 'Point',
      coordinates: [lng, lat],
      address: address || user.location?.address || 'Current Detected Location',
      accuracy: Number(accuracy) || 10,
      timestamp: now
    };
    await user.save();

    const locationPayload = {
      userId: user._id,
      name: user.name,
      role: user.role,
      latitude: lat,
      longitude: lng,
      coordinates: [lng, lat],
      accuracy: user.location.accuracy,
      timestamp: now.toISOString()
    };

    // If user is a driver, update Driver model location
    if (user.role === 'DRIVER') {
      const driver = await Driver.findOne({ userId: user._id });
      if (driver) {
        driver.location = {
          type: 'Point',
          coordinates: [lng, lat],
          accuracy: user.location.accuracy,
          updatedAt: now
        };
        await driver.save();

        locationPayload.driverId = driver._id;
        locationPayload.vehicle = driver.vehicle;
        locationPayload.availability = driver.availability;

        // Broadcast to specific active rescue room if driver is on a mission
        if (driver.activeDonationId) {
          locationPayload.donationId = driver.activeDonationId;
          const io = getIO();
          if (io) {
            io.to(`rescue:${driver.activeDonationId}`).emit('driver:location_updated', locationPayload);
          }
        }
      }
    }

    // Broadcast live location event globally to map clients
    const io = getIO();
    if (io) {
      if (user.role === 'DRIVER') {
        io.emit('driver:location_updated', locationPayload);
      } else {
        io.emit('user:location_updated', locationPayload);
      }
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      location: user.location
    });
  } catch (error) {
    next(error);
  }
};
