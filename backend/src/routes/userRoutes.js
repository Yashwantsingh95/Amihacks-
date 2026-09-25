const express = require('express');
const router = express.Router();
const { updateLocation } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.patch('/location', updateLocation);

module.exports = router;
