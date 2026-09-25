const Driver = require('../models/Driver');
const Donation = require('../models/Donation');
const Rescue = require('../models/Rescue');
const { emitRescueEvent } = require('../services/socketService');

const getDriverForUser = async (userId, userName) => {
  let driver = await Driver.findOne({ userId });
  if (!driver) {
    driver = await Driver.create({
      userId,
      name: userName || 'Rahul Sharma',
      phone: '+91 98765 43210',
      vehicle: 'Hero Electric Eco-Van (DL-01-EV-4289)',
      availability: 'AVAILABLE'
    });
  }
  return driver;
};

// @desc    Get Driver dashboard overview
// @route   GET /api/drivers/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const driver = await getDriverForUser(req.user._id, req.user.name);

    let activeRescue = null;
    if (driver.activeDonationId) {
      activeRescue = await Donation.findById(driver.activeDonationId)
        .populate('donorId', 'name email location')
        .populate('shelterId', 'name location');
    }

    res.json({
      success: true,
      driver,
      activeRescue,
      stats: {
        completedRescues: driver.completedRescuesCount || 0,
        availability: driver.availability
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assigned / pending pickup requests for this driver
// @route   GET /api/drivers/requests
exports.getRequests = async (req, res, next) => {
  try {
    const driver = await getDriverForUser(req.user._id, req.user.name);

    const requests = await Donation.find({
      $or: [
        { driverId: driver._id, status: { $in: ['ACCEPTED', 'PICKED_UP', 'ON_THE_WAY'] } },
        { status: 'ACCEPTED', driverId: null }
      ]
    })
      .populate('donorId', 'name email location')
      .populate('shelterId', 'name location');

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Driver accepts a pickup request
// @route   POST /api/drivers/requests/:id/accept
exports.acceptRequest = async (req, res, next) => {
  try {
    const driver = await getDriverForUser(req.user._id, req.user.name);
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.driverId = driver._id;
    await donation.save();

    driver.availability = 'BUSY';
    driver.activeDonationId = donation._id;
    await driver.save();

    // Update rescue
    const rescue = await Rescue.findOneAndUpdate(
      { donationId: donation._id },
      { driverId: driver._id },
      { new: true }
    );

    // Real-time socket event
    await emitRescueEvent('driver:accepted', {
      donationId: donation._id,
      driver: {
        id: driver._id,
        name: driver.name,
        phone: driver.phone,
        vehicle: driver.vehicle,
        location: driver.location
      }
    }, {
      rescueId: rescue ? rescue._id.toString() : donation._id.toString(),
      targetUserIds: [donation.donorId, donation.shelterId ? donation.shelterId.userId : null],
      notificationData: {
        title: 'Driver Confirmed Pickup Request',
        message: `${driver.name} is on the way to collect ${donation.foodType}.`,
        type: 'DRIVER_ACCEPTED',
        link: `/donor/tracking/${donation._id}`
      }
    });

    res.json({
      success: true,
      message: 'Pickup request accepted',
      donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Driver confirms pickup of boxes from donor
// @route   PATCH /api/drivers/requests/:id/pickup
exports.confirmPickup = async (req, res, next) => {
  try {
    const driver = await getDriverForUser(req.user._id, req.user.name);
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'PICKED_UP';
    await donation.save();

    const rescue = await Rescue.findOneAndUpdate(
      { donationId: donation._id },
      { status: 'PICKED_UP', pickedUpAt: new Date() },
      { new: true }
    );

    // Real-time socket event
    await emitRescueEvent('donation:picked_up', {
      donationId: donation._id,
      status: 'PICKED_UP'
    }, {
      rescueId: rescue ? rescue._id.toString() : donation._id.toString(),
      targetUserIds: [donation.donorId],
      notificationData: {
        title: 'Food Donation Picked Up',
        message: `${driver.name} verified and collected the ${donation.quantity} meals. Now en-route to shelter.`,
        type: 'PICKED_UP',
        link: `/donor/tracking/${donation._id}`
      }
    });

    res.json({
      success: true,
      message: 'Donation picked up. Transitioning to ON_THE_WAY.',
      donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Driver confirms safe delivery to shelter
// @route   PATCH /api/drivers/requests/:id/delivery
exports.confirmDelivery = async (req, res, next) => {
  try {
    const driver = await getDriverForUser(req.user._id, req.user.name);
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'DELIVERED';
    await donation.save();

    const rescue = await Rescue.findOneAndUpdate(
      { donationId: donation._id },
      { status: 'DELIVERED', deliveredAt: new Date() },
      { new: true }
    );

    // Free up driver
    driver.availability = 'AVAILABLE';
    driver.activeDonationId = null;
    driver.completedRescuesCount = (driver.completedRescuesCount || 0) + 1;
    await driver.save();

    // Real-time socket event & notifications to Donor and Shelter
    await emitRescueEvent('donation:delivered', {
      donationId: donation._id,
      status: 'DELIVERED',
      mealsRescued: donation.quantity
    }, {
      rescueId: rescue ? rescue._id.toString() : donation._id.toString(),
      targetUserIds: [donation.donorId],
      notificationData: {
        title: 'Delivery Completed! 🎉',
        message: `${donation.quantity} meals of ${donation.foodType} safely delivered. Thank you!`,
        type: 'DELIVERED',
        link: `/donor/impact`
      }
    });

    res.json({
      success: true,
      message: 'Delivery confirmed successfully! Impact updated.',
      donation,
      mealsRescued: donation.quantity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update driver current GPS location (Throttled & privacy protected)
// @route   PATCH /api/drivers/location
exports.updateLocation = async (req, res, next) => {
  try {
    const { lat, lng, accuracy, heading, speed } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide lat and lng' });
    }

    const driver = await getDriverForUser(req.user._id, req.user.name);
    driver.location = {
      type: 'Point',
      coordinates: [Number(lng), Number(lat)],
      accuracy: accuracy || 5,
      heading: heading || 0,
      speed: speed || 0,
      updatedAt: new Date()
    };
    await driver.save();

    // Privacy rule: Only broadcast driver's location if they have an active donation
    if (driver.activeDonationId) {
      // Update rescue record
      await Rescue.findOneAndUpdate(
        { donationId: driver.activeDonationId },
        {
          lastDriverLocation: {
            coordinates: [Number(lng), Number(lat)],
            accuracy,
            heading,
            speed,
            updatedAt: new Date()
          }
        }
      );

      // Emit real-time location only to the active rescue room (donor and shelter)
      await emitRescueEvent('driver:location_updated', {
        driverId: driver._id,
        donationId: driver.activeDonationId,
        coordinates: [Number(lng), Number(lat)],
        accuracy,
        heading,
        speed,
        updatedAt: new Date().toISOString()
      }, {
        rescueId: driver.activeDonationId.toString()
      });
    }

    res.json({
      success: true,
      location: driver.location
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get driver delivery history
// @route   GET /api/drivers/history
exports.getHistory = async (req, res, next) => {
  try {
    const driver = await getDriverForUser(req.user._id, req.user.name);

    const history = await Donation.find({
      driverId: driver._id,
      status: 'DELIVERED'
    })
      .populate('donorId', 'name location')
      .populate('shelterId', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};
