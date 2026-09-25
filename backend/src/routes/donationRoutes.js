const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  getDonationById
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('DONOR'), createDonation)
  .get(authorize('DONOR'), getDonations);

router.get('/my', authorize('DONOR'), getDonations);

router.route('/:id')
  .get(getDonationById);

module.exports = router;
