const express = require('express');
const router = express.Router();
const { getRescueTracking } = require('../controllers/rescueController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', getRescueTracking);

module.exports = router;
