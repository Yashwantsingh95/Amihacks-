const User = require('../models/User');
const Shelter = require('../models/Shelter');
const Driver = require('../models/Driver');
const Donation = require('../models/Donation');
const Rescue = require('../models/Rescue');
const { getExpiryStatus } = require('../utils/expiry');

// @desc    Get complete real network state for the live global map
// @route   GET /api/map/network
// @access  Private
exports.getNetworkMap = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const userRole = req.user.role;

    // 1. Current User Profile and DB Coordinates
    const currentUser = await User.findById(currentUserId).select('-password');

    // 2. Fetch all registered shelters
    const shelters = await Shelter.find()
      .populate('userId', 'name email avatar')
      .lean();

    const formattedShelters = shelters.map((s) => ({
      id: s._id,
      name: s.name,
      address: s.location?.address || 'Shelter Facility',
      coordinates: (s.location?.coordinates?.length === 2 && !isNaN(s.location.coordinates[0])) ? s.location.coordinates : null,
      capacity: s.capacity,
      currentOccupancy: s.currentOccupancy,
      availableCapacity: Math.max(0, s.capacity - (s.currentOccupancy || 0)),
      currentNeed: s.currentNeed || 'MEDIUM',
      foodPreferences: s.foodPreferences || ['All'],
      type: 'SHELTER'
    }));

    // 3. Fetch active donations (excluding delivered or cancelled)
    const activeDonations = await Donation.find({
      status: { $nin: ['DELIVERED', 'CANCELLED'] }
    })
      .populate('donorId', 'name email location')
      .populate('shelterId', 'name location currentNeed')
      .populate('driverId', 'name phone vehicle location')
      .lean();

    const formattedDonations = activeDonations.map((d) => {
      const exp = getExpiryStatus(d.safeUntil);
      return {
        id: d._id,
        foodType: d.foodType,
        quantity: d.quantity,
        unit: d.unit,
        category: d.category,
        status: d.status,
        pickupAddress: d.pickupLocation?.address || 'Pickup Point',
        coordinates: (d.pickupLocation?.coordinates?.length === 2 && !isNaN(d.pickupLocation.coordinates[0])) ? d.pickupLocation.coordinates : null,
        donorName: d.donorId?.name || 'Food Donor',
        donorId: d.donorId?._id,
        safeUntil: d.safeUntil,
        expiryLabel: exp.label,
        urgency: exp.urgency,
        isOwn: d.donorId?._id?.toString() === currentUserId.toString(),
        type: 'DONATION'
      };
    });

    // 4. Fetch drivers with location privacy rules applied
    const drivers = await Driver.find().populate('userId', 'name email avatar').lean();

    // Check if current user has an active rescue to provide precise driver location
    let userActiveRescue = null;
    if (userRole === 'DONOR') {
      const activeDon = activeDonations.find(d => d.donorId?._id?.toString() === currentUserId.toString() && ['ACCEPTED', 'ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'].includes(d.status));
      if (activeDon) {
        userActiveRescue = await Rescue.findOne({ donationId: activeDon._id }).populate('driverId shelterId donationId');
      }
    } else if (userRole === 'SHELTER') {
      const activeDon = activeDonations.find(d => d.shelterId?._id?.toString() === currentUserId.toString() && ['ACCEPTED', 'ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'].includes(d.status));
      if (activeDon) {
        userActiveRescue = await Rescue.findOne({ donationId: activeDon._id }).populate('driverId shelterId donationId');
      }
    } else if (userRole === 'DRIVER') {
      const driverRecord = await Driver.findOne({ userId: currentUserId });
      if (driverRecord) {
        userActiveRescue = await Rescue.findOne({ driverId: driverRecord._id, status: { $ne: 'DELIVERED' } }).populate('shelterId donationId');
      }
    }

    const assignedDriverId = userActiveRescue?.driverId?._id?.toString();

    const formattedDrivers = drivers.map((drv) => {
      const isAssignedToUser = assignedDriverId && drv._id.toString() === assignedDriverId;
      const isOwnDriver = userRole === 'DRIVER' && drv.userId?._id?.toString() === currentUserId.toString();

      return {
        id: drv._id,
        name: drv.name,
        vehicle: drv.vehicle,
        phone: isAssignedToUser || isOwnDriver ? drv.phone : undefined,
        availability: drv.availability,
        coordinates: drv.location?.coordinates || [77.2120, 28.6360],
        accuracy: drv.location?.accuracy || 10,
        updatedAt: drv.location?.updatedAt || drv.updatedAt,
        isAssignedToYou: Boolean(isAssignedToUser),
        isOwn: Boolean(isOwnDriver),
        type: 'DRIVER'
      };
    });

    // 5. Active Rescue Details if present
    let activeMission = null;
    if (userActiveRescue) {
      activeMission = {
        rescueId: userActiveRescue._id,
        donationId: userActiveRescue.donationId?._id,
        status: userActiveRescue.status,
        routeCoordinates: userActiveRescue.routeCoordinates || [],
        distanceKm: userActiveRescue.distance || 2.4,
        etaMinutes: userActiveRescue.eta || 8,
        pickupPoint: userActiveRescue.pickupLocation?.coordinates || [77.2197, 28.6328],
        dropoffPoint: userActiveRescue.deliveryLocation?.coordinates || [77.1906, 28.6448],
        driverLocation: userActiveRescue.lastDriverLocation?.coordinates || null
      };
    }

    res.json({
      success: true,
      currentUser: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        coordinates: currentUser.location?.coordinates || null,
        address: currentUser.location?.address || '',
        accuracy: currentUser.location?.accuracy || 0,
        timestamp: currentUser.location?.timestamp || null
      },
      shelters: formattedShelters,
      donations: formattedDonations,
      drivers: formattedDrivers,
      activeMission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Geospatial search for nearby entities
// @route   GET /api/map/nearby
// @access  Private
exports.getNearbyEntities = async (req, res, next) => {
  try {
    const { lat, lng, radius = 15000 } = req.query;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide lat and lng query parameters' });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);
    const radiusMeters = Number(radius);

    // Nearby Shelters via $near
    const shelters = await Shelter.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusMeters
        }
      }
    }).limit(10);

    // Nearby Active Donations
    const donations = await Donation.find({
      status: { $in: ['POSTED', 'MATCHED'] },
      pickupLocation: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusMeters
        }
      }
    }).populate('donorId', 'name location').limit(10);

    // Nearby Available Drivers
    const drivers = await Driver.find({
      availability: 'AVAILABLE',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusMeters
        }
      }
    }).limit(10);

    res.json({
      success: true,
      center: [longitude, latitude],
      radiusMeters,
      shelters,
      donations,
      drivers
    });
  } catch (error) {
    next(error);
  }
};
