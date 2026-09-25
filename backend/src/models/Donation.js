const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodType: {
    type: String,
    required: [true, 'Please provide food type']
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    default: 'Vegetarian'
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  unit: {
    type: String,
    default: 'meals'
  },
  pickupLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [77.2197, 28.6328]
    },
    address: { type: String, required: [true, 'Please provide pickup address'] }
  },
  safeUntil: {
    type: Date,
    required: [true, 'Please provide safe until / expiry time']
  },
  notes: {
    type: String,
    default: ''
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
    default: 'POSTED'
  },
  shelterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter',
    default: null
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// GeoJSON 2dsphere index for geospatial queries
donationSchema.index({ pickupLocation: '2dsphere' });

module.exports = mongoose.model('Donation', donationSchema);
