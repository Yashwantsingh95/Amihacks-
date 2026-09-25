const Rescue = require('../models/Rescue');
const Donation = require('../models/Donation');
const Driver = require('../models/Driver');
const Shelter = require('../models/Shelter');
const User = require('../models/User');
const { getRealDirections } = require('../services/mapService');
const mongoose = require('mongoose');

// @desc    Get complete rescue tracking details (by donation ID or rescue ID)
// @route   GET /api/rescues/:id
// @access  Public / Protected
exports.getRescueTracking = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    // 1. Check if ID matches Rescue or Donation
    let rescue = null;
    if (isValidId) {
      rescue = await Rescue.findById(id)
        .populate('donationId')
        .populate('donorId', 'name location email')
        .populate('shelterId', 'name location capacity')
        .populate('driverId', 'name phone vehicle location availability');

      if (!rescue) {
        rescue = await Rescue.findOne({ donationId: id })
          .populate('donationId')
          .populate('donorId', 'name location email')
          .populate('shelterId', 'name location capacity')
          .populate('driverId', 'name phone vehicle location availability');
      }
    }

    // 2. If no rescue but valid donation ID, build tracking response from Donation
    if (!rescue && isValidId) {
      const donation = await Donation.findById(id)
        .populate('donorId', 'name location email')
        .populate('shelterId', 'name location capacity')
        .populate('driverId', 'name phone vehicle location availability');

      if (donation) {
        const originCoords = donation.driverId?.location?.coordinates || 
                             donation.pickupLocation?.coordinates || 
                             donation.donorId?.location?.coordinates;
        const destCoords = donation.shelterId?.location?.coordinates;

        let distance = null;
        let eta = null;
        let routeCoords = [];

        if (originCoords && destCoords) {
          try {
            const computed = await getRealDirections(originCoords, destCoords);
            if (computed) {
              distance = computed.distanceKm;
              eta = computed.durationMinutes;
              routeCoords = computed.coordinates || [];
            }
          } catch (e) {
            console.warn('[Donation direct routing notice]', e.message);
          }
        }

        return res.json({
          success: true,
          rescue: {
            _id: donation._id,
            donationId: donation._id,
            status: donation.status,
            foodType: donation.foodType,
            quantity: donation.quantity,
            unit: donation.unit,
            driver: donation.driverId ? {
              name: donation.driverId.name,
              phone: donation.driverId.phone,
              vehicle: donation.driverId.vehicle,
              location: donation.driverId.location
            } : null,
            pickup: {
              address: donation.pickupLocation?.address || donation.donorId?.location?.address || 'Pickup Point',
              location: donation.pickupLocation || donation.donorId?.location
            },
            destination: {
              name: donation.shelterId?.name || 'Shelter Facility',
              address: donation.shelterId?.location?.address || 'Shelter Destination',
              location: donation.shelterId?.location
            },
            distance,
            eta,
            routeCoordinates: routeCoords,
            pickupLocation: donation.pickupLocation || donation.donorId?.location,
            deliveryLocation: donation.shelterId?.location,
            lastDriverLocation: donation.driverId?.location
          }
        });
      }
    }

    // 3. Fallback: If not found or ID is demo string (e.g. DON-1024), fetch latest active rescue
    if (!rescue) {
      rescue = await Rescue.findOne({ status: { $ne: 'DELIVERED' } })
        .sort({ createdAt: -1 })
        .populate('donationId')
        .populate('donorId', 'name location email')
        .populate('shelterId', 'name location capacity')
        .populate('driverId', 'name phone vehicle location availability');

      if (!rescue) {
        rescue = await Rescue.findOne()
          .sort({ createdAt: -1 })
          .populate('donationId')
          .populate('donorId', 'name location email')
          .populate('shelterId', 'name location capacity')
          .populate('driverId', 'name phone vehicle location availability');
      }
    }

    if (!rescue) {
      return res.status(404).json({ success: false, message: 'Rescue tracking data not found' });
    }

    // 4. Ensure real dynamic route is calculated if distance/eta are missing
    const originCoords = rescue.driverId?.location?.coordinates || 
                         rescue.donationId?.pickupLocation?.coordinates || 
                         rescue.donorId?.location?.coordinates;
    const destCoords = rescue.shelterId?.location?.coordinates;

    let distance = rescue.distance;
    let eta = rescue.estimatedTime;
    let routeCoords = rescue.routeCoordinates || [];

    if ((!distance || !eta || routeCoords.length === 0) && originCoords && destCoords) {
      try {
        const computed = await getRealDirections(originCoords, destCoords);
        if (computed) {
          distance = computed.distanceKm;
          eta = computed.durationMinutes;
          routeCoords = computed.coordinates || [];
          rescue.distance = distance;
          rescue.estimatedTime = eta;
          rescue.routeCoordinates = routeCoords;
          await rescue.save().catch(() => {});
        }
      } catch (e) {
        console.warn('[Rescue routing notice]', e.message);
      }
    }

    return res.json({
      success: true,
      rescue: {
        _id: rescue._id,
        donationId: rescue.donationId?._id,
        status: rescue.status,
        foodType: rescue.donationId?.foodType,
        quantity: rescue.donationId?.quantity,
        unit: rescue.donationId?.unit,
        driver: rescue.driverId ? {
          name: rescue.driverId.name,
          phone: rescue.driverId.phone,
          vehicle: rescue.driverId.vehicle,
          location: rescue.driverId.location
        } : null,
        pickup: {
          address: rescue.donationId?.pickupLocation?.address || rescue.donorId?.location?.address || 'Pickup Point',
          location: rescue.donationId?.pickupLocation || rescue.donorId?.location
        },
        destination: {
          name: rescue.shelterId?.name || 'Shelter Facility',
          address: rescue.shelterId?.location?.address || 'Shelter Destination',
          location: rescue.shelterId?.location
        },
        distance,
        eta,
        routeCoordinates: routeCoords,
        pickupLocation: rescue.donationId?.pickupLocation || rescue.donorId?.location,
        deliveryLocation: rescue.shelterId?.location,
        lastDriverLocation: rescue.driverId?.location || rescue.lastDriverLocation,
        matchedAt: rescue.matchedAt,
        acceptedAt: rescue.acceptedAt,
        pickedUpAt: rescue.pickedUpAt,
        deliveredAt: rescue.deliveredAt
      }
    });
  } catch (error) {
    next(error);
  }
};

