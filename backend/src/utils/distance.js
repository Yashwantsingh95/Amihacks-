// Calculate haversine distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.5; // default fallback

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Estimate driving time in minutes (assuming 25 km/h urban traffic speed)
function estimateDrivingTimeMinutes(distanceKm) {
  const speedKmH = 22; // urban average
  const hours = distanceKm / speedKmH;
  return Math.max(3, Math.round(hours * 60));
}

module.exports = {
  calculateDistance,
  estimateDrivingTimeMinutes
};
