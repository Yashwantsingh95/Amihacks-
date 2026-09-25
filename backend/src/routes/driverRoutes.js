const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getRequests,
  acceptRequest,
  confirmPickup,
  confirmDelivery,
  updateLocation,
  getHistory
} = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('DRIVER'));

router.get('/dashboard', getDashboard);
router.get('/requests', getRequests);
router.post('/requests/:id/accept', acceptRequest);
router.patch('/requests/:id/pickup', confirmPickup);
router.patch('/requests/:id/delivery', confirmDelivery);
router.patch('/location', updateLocation);
router.get('/history', getHistory);

module.exports = router;
