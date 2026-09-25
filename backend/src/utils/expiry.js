function getExpiryStatus(safeUntilDate) {
  const now = new Date();
  const safeUntil = new Date(safeUntilDate);
  const diffMs = safeUntil.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes <= 0) {
    return {
      status: 'EXPIRED',
      isExpired: true,
      remainingMinutes: 0,
      urgency: 'EXPIRED',
      label: 'Expired'
    };
  }

  if (diffMinutes < 30) {
    return {
      status: 'ACTIVE',
      isExpired: false,
      remainingMinutes: diffMinutes,
      urgency: 'URGENT',
      label: `${diffMinutes}m remaining (Urgent)`
    };
  }

  if (diffMinutes <= 60) {
    return {
      status: 'ACTIVE',
      isExpired: false,
      remainingMinutes: diffMinutes,
      urgency: 'EXPIRING_SOON',
      label: `${diffMinutes}m remaining`
    };
  }

  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return {
    status: 'ACTIVE',
    isExpired: false,
    remainingMinutes: diffMinutes,
    urgency: 'NORMAL',
    label: `${hours}h ${mins}m remaining`
  };
}

module.exports = {
  getExpiryStatus
};
