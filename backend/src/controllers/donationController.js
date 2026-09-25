const Donation = require('../models/Donation');
const Shelter = require('../models/Shelter');
const Driver = require('../models/Driver');
const { getExpiryStatus } = require('../utils/expiry');
const { geocodeAddress } = require('../services/mapService');
const { emitRescueEvent } = require('../services/socketService');

// @desc    Create a surplus food donation
// @route   POST /api/donations
// @access  Private (Donor only)
exports.createDonation = async (req, res, next) => {
  try {
    const {
      foodType,
      category,
      quantity,
      unit,
      pickupLocation,
      safeUntil,
      notes
    } = req.body;

    if (!foodType || !quantity || !safeUntil) {
      return res.status(400).json({
        success: false,
        message: 'Please provide foodType, quantity, and safeUntil time'
      });
    }

    const safeDate = new Date(safeUntil);
    if (isNaN(safeDate.getTime()) || safeDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Safe-until time must be a valid future timestamp'
      });
    }

    // Geocode address if string provided
    let locationData = {
      type: 'Point',
      coordinates: [77.2197, 28.6328],
      address: 'ABC Restaurant, Connaught Place, New Delhi'
    };

    if (pickupLocation && typeof pickupLocation === 'object' && pickupLocation.coordinates) {
      locationData = {
        type: 'Point',
        coordinates: pickupLocation.coordinates,
        address: pickupLocation.address || 'Pickup Point'
      };
    } else if (pickupLocation && typeof pickupLocation === 'string') {
      const geo = await geocodeAddress(pickupLocation);
      locationData = {
        type: 'Point',
        coordinates: geo.coordinates,
        address: geo.formattedAddress || pickupLocation
      };
    } else if (req.user.location && req.user.location.coordinates) {
      locationData = req.user.location;
    }

    const donation = await Donation.create({
      donorId: req.user._id,
      foodType,
      category: category || 'Vegetarian',
      quantity: Number(quantity),
      unit: unit || 'meals',
      pickupLocation: locationData,
      safeUntil: safeDate,
      notes: notes || '',
      status: 'POSTED'
    });

    // Notify registered shelters about new donation
    const shelters = await Shelter.find().limit(5);
    const shelterUserIds = shelters.map(s => s.userId);

    await emitRescueEvent('donation:created', donation, {
      targetUserIds: shelterUserIds,
      notificationData: {
        title: 'New Surplus Food Posted',
        message: `${donation.quantity} ${donation.unit} of ${donation.foodType} posted near you.`,
        type: 'DONATION_CREATED',
        link: `/shelter/donations/${donation._id}`
      }
    });

    res.status(201).json({
      success: true,
      donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (filtered by user if donor)
// @route   GET /api/donations
// @access  Private
exports.getDonations = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user && req.user.role === 'DONOR') {
      filter.donorId = req.user._id;
    }

    const donations = await Donation.find(filter)
      .populate('donorId', 'name email location')
      .populate('shelterId', 'name location capacity currentNeed')
      .populate('driverId', 'name phone vehicle location')
      .sort({ createdAt: -1 });

    const updated = donations.map((d) => {
      const exp = getExpiryStatus(d.safeUntil);
      if (exp.isExpired && d.status !== 'DELIVERED' && d.status !== 'CANCELLED') {
        d.status = 'EXPIRED';
      }
      return {
        ...d.toObject(),
        expiryInfo: exp
      };
    });

    res.json({
      success: true,
      count: updated.length,
      donations: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Private
exports.getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email location')
      .populate('shelterId', 'name location capacity currentNeed currentOccupancy')
      .populate('driverId', 'name phone vehicle location');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    const exp = getExpiryStatus(donation.safeUntil);
    if (exp.isExpired && donation.status !== 'DELIVERED' && donation.status !== 'CANCELLED') {
      donation.status = 'EXPIRED';
      await donation.save();
    }

    res.json({
      success: true,
      donation: {
        ...donation.toObject(),
        expiryInfo: exp
      }
    });
  } catch (error) {
    next(error);
  }
};
