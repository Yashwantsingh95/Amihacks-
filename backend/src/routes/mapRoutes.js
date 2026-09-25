const express = require('express');
const router = express.Router();
const { getNetworkMap, getNearbyEntities } = require('../controllers/mapController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/network', getNetworkMap);
router.get('/nearby', getNearbyEntities);

module.exports = router;
