const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  vehicle: {
    type: String,
    default: 'Hero Electric Eco-Van (DL-01-EV-4289)'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [77.2120, 28.6360]
    },
    accuracy: { type: Number, default: 0 },
    heading: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
  },
  availability: {
    type: String,
    enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
    default: 'AVAILABLE'
  },
  activeDonationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    default: null
  },
  completedRescuesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// GeoJSON 2dsphere index for finding nearest available drivers
driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);
