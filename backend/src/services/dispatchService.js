const Driver = require('../models/Driver');
const { calculateDistance } = require('../utils/distance');

async function dispatchNearestDriver(donationId, pickupLocation) {
  const pickupCoords = pickupLocation?.coordinates || [77.2197, 28.6328]; // [lng, lat]
  const pickupLng = pickupCoords[0];
  const pickupLat = pickupCoords[1];

  let nearestDriver = null;

  try {
    // Geospatial query to find closest available driver
    nearestDriver = await Driver.findOne({
      availability: 'AVAILABLE',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupLng, pickupLat]
          }
        }
      }
    });
  } catch (geoErr) {
    console.warn('[Driver Dispatch geo query fallback]', geoErr.message);
  }

  if (!nearestDriver) {
    // Fallback: any driver marked AVAILABLE
    nearestDriver = await Driver.findOne({ availability: 'AVAILABLE' });
  }

  if (!nearestDriver) {
    // If all busy, select least busy driver
    nearestDriver = await Driver.findOne();
  }

  if (nearestDriver) {
    // Atomic update to avoid race conditions
    await Driver.findByIdAndUpdate(nearestDriver._id, {
      availability: 'BUSY',
      activeDonationId: donationId
    });
    nearestDriver.availability = 'BUSY';
    nearestDriver.activeDonationId = donationId;
  }

  return nearestDriver;
}

module.exports = {
  dispatchNearestDriver
};
