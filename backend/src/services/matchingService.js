const Shelter = require('../models/Shelter');
const Donation = require('../models/Donation');
const { calculateDistance, estimateDrivingTimeMinutes } = require('../utils/distance');
const { getExpiryStatus } = require('../utils/expiry');
const { getRealDirections } = require('./mapService');

/**
 * Real Geospatial Matching Engine with Explainable Factors
 */
async function findBestShelterMatch(donationId, excludedShelterIds = []) {
  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw new Error('Donation not found');
  }

  // Check expiry server-side
  const expiryCheck = getExpiryStatus(donation.safeUntil);
  if (expiryCheck.isExpired) {
    donation.status = 'EXPIRED';
    await donation.save();
    throw new Error('Donation has expired and cannot be matched');
  }

  const pickupCoords = donation.pickupLocation?.coordinates || [77.2197, 28.6328]; // [lng, lat]
  const pickupLng = pickupCoords[0];
  const pickupLat = pickupCoords[1];

  // Geospatial query: Find shelters within 25km radius sorted by proximity
  let nearbyShelters = [];
  try {
    nearbyShelters = await Shelter.find({
      _id: { $nin: excludedShelterIds },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupLng, pickupLat]
          },
          $maxDistance: 25000 // 25,000 meters = 25 km
        }
      }
    });
  } catch (geoErr) {
    console.warn('[Geospatial Query fallback]', geoErr.message);
    nearbyShelters = await Shelter.find({
      _id: { $nin: excludedShelterIds }
    });
  }

  if (!nearbyShelters || nearbyShelters.length === 0) {
    // If none within 25km, widen search to any active shelter
    nearbyShelters = await Shelter.find({
      _id: { $nin: excludedShelterIds }
    });
  }

  if (nearbyShelters.length === 0) {
    return {
      success: false,
      message: 'No available shelter partners found within service territory.'
    };
  }

  const scoredShelters = [];

  for (const shelter of nearbyShelters) {
    const sCoords = shelter.location?.coordinates || [77.2065, 28.6289];
    const sLng = sCoords[0];
    const sLat = sCoords[1];

    // Real distance
    const distanceKm = calculateDistance(pickupLat, pickupLng, sLat, sLng);
    const etaMinutes = estimateDrivingTimeMinutes(distanceKm);

    // Distance Score (0 to 100)
    const distanceScore = Math.max(0, Math.min(100, 100 - (distanceKm / 10) * 100));

    // Capacity Score (0 to 100)
    const availableCapacity = Math.max(0, shelter.capacity - shelter.currentOccupancy);
    let capacityScore = 0;
    if (availableCapacity >= donation.quantity) {
      capacityScore = 100;
    } else if (availableCapacity > 0) {
      capacityScore = Math.round((availableCapacity / donation.quantity) * 80);
    } else {
      capacityScore = 10;
    }

    // Food Compatibility Score
    let foodMatchScore = 70;
    const prefs = shelter.foodPreferences || [];
    const donationCat = (donation.category || '').toLowerCase();
    const isCompat = prefs.some((p) => {
      const pL = p.toLowerCase();
      return pL.includes(donationCat) || donationCat.includes(pL) || pL === 'all';
    });
    if (isCompat) {
      foodMatchScore = 100;
    }

    // Current Need Score
    let needScore = 50;
    if (shelter.currentNeed === 'HIGH') needScore = 100;
    else if (shelter.currentNeed === 'MEDIUM') needScore = 75;
    else if (shelter.currentNeed === 'LOW') needScore = 40;

    // Time Urgency Score
    let urgencyScore = 70;
    if (expiryCheck.urgency === 'URGENT') urgencyScore = 100;
    else if (expiryCheck.urgency === 'EXPIRING_SOON') urgencyScore = 85;

    // Weighted explainable composite score
    const totalScore = Math.round(
      distanceScore * 0.25 +
      capacityScore * 0.25 +
      foodMatchScore * 0.20 +
      needScore * 0.15 +
      urgencyScore * 0.15
    );

    // Human-readable, transparent reasoning bullets as explicitly requested:
    const reasons = [
      `${distanceKm} km away (~${etaMinutes} mins drive)`,
      `Shelter has capacity for ${availableCapacity} meals (needed: ${donation.quantity})`,
      `Accepts ${donation.category} meals`,
      `Current emergency need: ${shelter.currentNeed}`,
      `Food safely usable for ${expiryCheck.remainingMinutes} minutes`
    ];

    scoredShelters.push({
      shelterId: shelter._id,
      shelterName: shelter.name,
      location: shelter.location,
      distance: distanceKm,
      estimatedMinutes: etaMinutes,
      availableCapacity,
      currentNeed: shelter.currentNeed,
      score: totalScore,
      reasons
    });
  }

  // Sort descending by score
  scoredShelters.sort((a, b) => b.score - a.score);

  return {
    success: true,
    match: scoredShelters[0],
    alternatives: scoredShelters.slice(1, 4)
  };
}

module.exports = {
  findBestShelterMatch
};
