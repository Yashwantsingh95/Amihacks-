const express = require('express');
const router = express.Router();
const { geocode, getDirections, updateUserLocation, search, reverse } = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', search);
router.post('/reverse', reverse);
router.post('/geocode', geocode);
router.post('/directions', getDirections);
router.patch('/users/location', protect, updateUserLocation);

module.exports = router;
