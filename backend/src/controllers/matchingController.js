const Donation = require('../models/Donation');
const Shelter = require('../models/Shelter');
const Rescue = require('../models/Rescue');
const { findBestShelterMatch } = require('../services/matchingService');
const { emitRescueEvent } = require('../services/socketService');

// @desc    Find best shelter match for a donation
// @route   POST /api/matching/find
// @access  Private
exports.findMatch = async (req, res, next) => {
  try {
    const { donationId, excludedShelterIds } = req.body;

    if (!donationId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide donationId'
      });
    }

    const result = await findBestShelterMatch(donationId, excludedShelterIds || []);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm match selection
// @route   POST /api/matching/confirm
// @access  Private (Donor only)
exports.confirmMatch = async (req, res, next) => {
  try {
    const { donationId, shelterId } = req.body;

    if (!donationId || !shelterId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide donationId and shelterId'
      });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    const shelter = await Shelter.findById(shelterId);
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }

    donation.shelterId = shelter._id;
    donation.status = 'MATCHED';
    await donation.save();

    // Create or update Rescue entry
    let rescue = await Rescue.findOne({ donationId: donation._id });
    if (!rescue) {
      rescue = await Rescue.create({
        donationId: donation._id,
        donorId: donation.donorId,
        shelterId: shelter._id,
        status: 'MATCHED',
        matchedAt: new Date()
      });
    } else {
      rescue.shelterId = shelter._id;
      rescue.status = 'MATCHED';
      rescue.matchedAt = new Date();
      await rescue.save();
    }

    // Emit real-time socket event & notify matched shelter
    await emitRescueEvent('donation:matched', {
      donationId: donation._id,
      shelterId: shelter._id,
      rescueId: rescue._id,
      foodType: donation.foodType,
      quantity: donation.quantity
    }, {
      rescueId: rescue._id.toString(),
      targetUserIds: [shelter.userId],
      notificationData: {
        title: 'New Food Rescue Matched',
        message: `${donation.quantity} meals of ${donation.foodType} matched with your shelter.`,
        type: 'DONATION_MATCHED',
        link: `/shelter/donations/${donation._id}`
      }
    });

    res.json({
      success: true,
      donation,
      rescue
    });
  } catch (error) {
    next(error);
  }
};
