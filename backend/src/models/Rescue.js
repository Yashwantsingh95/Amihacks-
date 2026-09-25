const mongoose = require('mongoose');

const rescueSchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true,
    index: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shelterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  status: {
    type: String,
    enum: [
      'POSTED',
      'MATCHED',
      'ACCEPTED',
      'PICKED_UP',
      'ON_THE_WAY',
      'DELIVERED',
      'EXPIRED',
      'CANCELLED'
    ],
    default: 'MATCHED'
  },
  distance: {
    type: Number,
    default: 2.1
  },
  estimatedTime: {
    type: Number,
    default: 8 // minutes
  },
  routeCoordinates: {
    type: [[Number]], // array of [lng, lat] representing real road polyline
    default: []
  },
  lastDriverLocation: {
    coordinates: {
      type: [Number], // [lng, lat]
      default: [77.2120, 28.6360]
    },
    accuracy: Number,
    heading: Number,
    speed: Number,
    updatedAt: { type: Date, default: Date.now }
  },
  matchedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  pickedUpAt: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Rescue', rescueSchema);
