const Shelter = require('../models/Shelter');
const Donation = require('../models/Donation');
const Rescue = require('../models/Rescue');
const Driver = require('../models/Driver');
const { getExpiryStatus } = require('../utils/expiry');
const { dispatchNearestDriver } = require('../services/dispatchService');
const { findBestShelterMatch } = require('../services/matchingService');
const { getRealDirections } = require('../services/mapService');
const { emitRescueEvent } = require('../services/socketService');

const User = require('../models/User');

const getShelterForUser = async (userId) => {
  let shelter = await Shelter.findOne({ userId });
  if (!shelter) {
    const user = await User.findById(userId);
    shelter = await Shelter.create({
      userId,
      name: user?.name || 'Shelter Facility',
      capacity: 100,
      currentOccupancy: 0,
      ...(user?.location?.coordinates ? { location: user.location } : {})
    });
  }
  return shelter;
};

// @desc    Update shelter location explicitly chosen on map
// @route   PATCH /api/shelters/location
exports.updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, address } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    const shelter = await getShelterForUser(req.user._id);

    shelter.location = {
      type: 'Point',
      coordinates: [lng, lat],
      address: address ? address.trim() : 'Registered Shelter Location'
    };
    await shelter.save();

    // Also sync to User document
    await User.findByIdAndUpdate(req.user._id, {
      location: shelter.location
    });

    res.json({
      success: true,
      message: 'Shelter location confirmed and registered',
      shelter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Shelter Dashboard stats & overview
// @route   GET /api/shelters/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const shelter = await getShelterForUser(req.user._id);

    const pendingMatches = await Donation.countDocuments({
      shelterId: shelter._id,
      status: 'MATCHED'
    });

    const activeDeliveries = await Donation.countDocuments({
      shelterId: shelter._id,
      status: { $in: ['ACCEPTED', 'PICKED_UP', 'ON_THE_WAY'] }
    });

    const totalReceived = await Donation.countDocuments({
      shelterId: shelter._id,
      status: 'DELIVERED'
    });

    res.json({
      success: true,
      shelter,
      stats: {
        pendingMatches,
        activeDeliveries,
        totalReceived,
        availableCapacity: Math.max(0, shelter.capacity - shelter.currentOccupancy)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donations available or matched to this shelter
// @route   GET /api/shelters/donations
exports.getDonations = async (req, res, next) => {
  try {
    const shelter = await getShelterForUser(req.user._id);

    const donations = await Donation.find({
      $or: [
        { shelterId: shelter._id },
        { status: 'POSTED' }
      ]
    })
      .populate('donorId', 'name email location')
      .populate('driverId', 'name phone vehicle location')
      .sort({ createdAt: -1 });

    const processed = donations.map((d) => ({
      ...d.toObject(),
      expiryInfo: getExpiryStatus(d.safeUntil)
    }));

    res.json({
      success: true,
      count: processed.length,
      donations: processed
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific donation details for shelter
// @route   GET /api/shelters/donations/:id
exports.getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email location')
      .populate('driverId', 'name phone vehicle location');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.json({
      success: true,
      donation: {
        ...donation.toObject(),
        expiryInfo: getExpiryStatus(donation.safeUntil)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shelter capacity & occupancy
// @route   PATCH /api/shelters/capacity
exports.updateCapacity = async (req, res, next) => {
  try {
    const shelter = await getShelterForUser(req.user._id);
    const { capacity, currentOccupancy, currentNeed } = req.body;

    if (capacity !== undefined) shelter.capacity = Number(capacity);
    if (currentOccupancy !== undefined) shelter.currentOccupancy = Number(currentOccupancy);
    if (currentNeed !== undefined) shelter.currentNeed = currentNeed;

    await shelter.save();

    res.json({
      success: true,
      shelter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Shelter accepts a matched donation (Dispatches nearest driver & computes real road route)
// @route   POST /api/shelters/donations/:id/accept
exports.acceptDonation = async (req, res, next) => {
  try {
    const shelter = await getShelterForUser(req.user._id);
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Verify not expired
    const exp = getExpiryStatus(donation.safeUntil);
    if (exp.isExpired) {
      donation.status = 'EXPIRED';
      await donation.save();
      return res.status(400).json({
        success: false,
        message: 'Donation has expired and cannot be accepted'
      });
    }

    // Check capacity atomically
    const availableCapacity = shelter.capacity - shelter.currentOccupancy;
    if (availableCapacity < donation.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient capacity: available ${availableCapacity}, required ${donation.quantity}`
      });
    }

    // Atomic update to shelter occupancy
    await Shelter.findByIdAndUpdate(shelter._id, {
      $inc: { currentOccupancy: donation.quantity }
    });

    // Update donation status
    donation.status = 'ACCEPTED';
    donation.shelterId = shelter._id;

    // Automatically dispatch nearest available driver
    const assignedDriver = await dispatchNearestDriver(donation._id, donation.pickupLocation);
    if (assignedDriver) {
      donation.driverId = assignedDriver._id;
    }
    await donation.save();

    // Compute real road routing between donor pickup and shelter
    const originCoords = donation.pickupLocation?.coordinates || [77.2197, 28.6328];
    const shelterCoords = shelter.location?.coordinates || [77.1906, 28.6448];
    const realRoute = await getRealDirections(originCoords, shelterCoords);

    // Create / update Rescue
    let rescue = await Rescue.findOne({ donationId: donation._id });
    if (!rescue) {
      rescue = await Rescue.create({
        donationId: donation._id,
        donorId: donation.donorId,
        shelterId: shelter._id,
        driverId: assignedDriver ? assignedDriver._id : null,
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        distance: realRoute.distanceKm,
        estimatedTime: realRoute.durationMinutes,
        routeCoordinates: realRoute.coordinates,
        lastDriverLocation: {
          coordinates: assignedDriver?.location?.coordinates || originCoords,
          updatedAt: new Date()
        }
      });
    } else {
      rescue.status = 'ACCEPTED';
      rescue.shelterId = shelter._id;
      rescue.driverId = assignedDriver ? assignedDriver._id : rescue.driverId;
      rescue.acceptedAt = new Date();
      rescue.distance = realRoute.distanceKm;
      rescue.estimatedTime = realRoute.durationMinutes;
      rescue.routeCoordinates = realRoute.coordinates;
      await rescue.save();
    }

    // Real-time Socket.IO emission to Donor & Driver
    await emitRescueEvent('donation:accepted', {
      donationId: donation._id,
      shelterId: shelter._id,
      driverId: assignedDriver ? assignedDriver._id : null,
      status: 'ACCEPTED',
      distance: realRoute.distanceKm,
      eta: realRoute.durationMinutes,
      routeCoordinates: realRoute.coordinates
    }, {
      rescueId: rescue._id.toString(),
      targetUserIds: [donation.donorId, assignedDriver ? assignedDriver.userId : null],
      notificationData: {
        title: 'Rescue Match Accepted!',
        message: `${shelter.name} accepted your donation. Driver ${assignedDriver ? assignedDriver.name : 'assigned'} is en-route.`,
        type: 'DONATION_ACCEPTED',
        link: `/donor/tracking/${donation._id}`
      }
    });

    res.json({
      success: true,
      message: 'Donation accepted and driver dispatched',
      donation,
      driver: assignedDriver,
      rescue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Shelter rejects a matched donation (Triggers Fallback Matching)
// @route   POST /api/shelters/donations/:id/reject
exports.rejectDonation = async (req, res, next) => {
  try {
    const shelter = await getShelterForUser(req.user._id);
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Fallback: search next best match excluding this shelter
    const fallback = await findBestShelterMatch(donation._id, [shelter._id]);

    if (fallback.success && fallback.match) {
      donation.shelterId = fallback.match.shelterId;
      donation.status = 'MATCHED';
      await donation.save();

      // Emit fallback notification to new shelter
      const newShelter = await Shelter.findById(fallback.match.shelterId);
      if (newShelter) {
        await emitRescueEvent('donation:matched', {
          donationId: donation._id,
          shelterId: newShelter._id
        }, {
          targetUserIds: [newShelter.userId],
          notificationData: {
            title: 'Inbound Rescue Match (Rerouted)',
            message: `${donation.quantity} meals of ${donation.foodType} rerouted to your shelter.`,
            type: 'DONATION_MATCHED',
            link: `/shelter/donations/${donation._id}`
          }
        });
      }

      return res.json({
        success: true,
        message: `Shelter passed. Fallback match routed to ${fallback.match.shelterName}`,
        newMatch: fallback.match,
        donation
      });
    } else {
      donation.status = 'POSTED';
      donation.shelterId = null;
      await donation.save();

      return res.json({
        success: true,
        message: 'Shelter passed. Returned to surplus pool for matching.',
        donation
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get accepted donations for this shelter
// @route   GET /api/shelters/accepted
exports.getAcceptedDonations = async (req, res, next) => {
  try {
    const shelter = await getShelterForUser(req.user._id);

    const donations = await Donation.find({
      shelterId: shelter._id,
      status: { $in: ['ACCEPTED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'] }
    })
      .populate('donorId', 'name email location')
      .populate('driverId', 'name phone vehicle location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rescue tracking details for shelter view
// @route   GET /api/shelters/tracking/:id
exports.getTracking = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email location')
      .populate('shelterId', 'name location')
      .populate('driverId', 'name phone vehicle location');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    const rescue = await Rescue.findOne({ donationId: donation._id });

    res.json({
      success: true,
      donation,
      rescue
    });
  } catch (error) {
    next(error);
  }
};
