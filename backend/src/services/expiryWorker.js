const Donation = require('../models/Donation');
const { emitRescueEvent } = require('./socketService');

let workerInterval = null;

function startExpiryWorker(intervalMs = 30000) {
  if (workerInterval) return;

  workerInterval = setInterval(async () => {
    try {
      const now = new Date();

      // Find donations that have passed safeUntil and are not yet picked up or delivered
      const expiredDonations = await Donation.find({
        safeUntil: { $lte: now },
        status: { $in: ['POSTED', 'MATCHED'] }
      });

      for (const d of expiredDonations) {
        d.status = 'EXPIRED';
        await d.save();

        console.log(`[Expiry Worker] Donation ${d._id} (${d.foodType}) marked EXPIRED`);

        await emitRescueEvent('donation:expired', { donationId: d._id, status: 'EXPIRED' }, {
          targetUserIds: [d.donorId],
          notificationData: {
            title: 'Donation Expired',
            message: `Your donation of "${d.foodType}" has exceeded its safe consumption window.`,
            type: 'EXPIRED',
            link: `/donor/donation/${d._id}`
          }
        });
      }
    } catch (err) {
      console.warn('[Expiry Worker Error]', err.message);
    }
  }, intervalMs);

  console.log(`[Expiry Worker] Background worker started (runs every ${intervalMs / 1000}s)`);
}

function stopExpiryWorker() {
  if (workerInterval) {
    clearInterval(workerInterval);
    workerInterval = null;
  }
}

module.exports = {
  startExpiryWorker,
  stopExpiryWorker
};
