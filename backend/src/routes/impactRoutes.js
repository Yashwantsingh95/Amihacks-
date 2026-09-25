const express = require('express');
const router = express.Router();
const {
  getDonorImpact,
  getShelterImpact,
  getDriverImpact,
  getGlobalImpact
} = require('../controllers/impactController');

router.get('/global', getGlobalImpact);
router.get('/donor/:id', getDonorImpact);
router.get('/shelter/:id', getShelterImpact);
router.get('/driver/:id', getDriverImpact);

module.exports = router;
