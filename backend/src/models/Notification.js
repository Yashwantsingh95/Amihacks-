const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'DONATION_CREATED',
      'DONATION_MATCHED',
      'DONATION_ACCEPTED',
      'DRIVER_ASSIGNED',
      'DRIVER_ACCEPTED',
      'PICKED_UP',
      'ON_THE_WAY',
      'DELIVERED',
      'EXPIRING_SOON',
      'EXPIRED',
      'SYSTEM'
    ],
    default: 'SYSTEM'
  },
  link: {
    type: String,
    default: ''
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
