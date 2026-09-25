const { calculateImpact } = require('../services/impactService');

// @desc    Get donor specific impact
// @route   GET /api/impact/donor/:id
exports.getDonorImpact = async (req, res, next) => {
  try {
    const impact = await calculateImpact({ donorId: req.params.id });
    res.json({ success: true, impact });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shelter specific impact
// @route   GET /api/impact/shelter/:id
exports.getShelterImpact = async (req, res, next) => {
  try {
    const impact = await calculateImpact({ shelterId: req.params.id });
    res.json({ success: true, impact });
  } catch (error) {
    next(error);
  }
};

// @desc    Get driver specific impact
// @route   GET /api/impact/driver/:id
exports.getDriverImpact = async (req, res, next) => {
  try {
    const impact = await calculateImpact({ driverId: req.params.id });
    res.json({ success: true, impact });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform global impact
// @route   GET /api/impact/global
exports.getGlobalImpact = async (req, res, next) => {
  try {
    const impact = await calculateImpact({});
    res.json({
      success: true,
      impact: {
        ...impact,
        totalMealsAllTime: '1.2M',
        totalTonsAllTime: '430T',
        totalRescuesAllTime: '28K'
      }
    });
  } catch (error) {
    next(error);
  }
};
