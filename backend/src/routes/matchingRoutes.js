const express = require('express');
const router = express.Router();
const { findMatch, confirmMatch } = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('DONOR'));

router.post('/find', findMatch);
router.post('/confirm', confirmMatch);

module.exports = router;
