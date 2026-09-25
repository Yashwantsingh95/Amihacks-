const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getDonations,
  getDonationById,
  updateCapacity,
  updateLocation,
  acceptDonation,
  rejectDonation,
  getAcceptedDonations,
  getTracking
} = require('../controllers/shelterController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('SHELTER'));

router.get('/dashboard', getDashboard);
router.get('/donations', getDonations);
router.get('/donations/:id', getDonationById);
router.patch('/capacity', updateCapacity);
router.patch('/location', updateLocation);
router.post('/donations/:id/accept', acceptDonation);
router.post('/donations/:id/reject', rejectDonation);
router.get('/accepted', getAcceptedDonations);
router.get('/tracking/:id', getTracking);

module.exports = router;
