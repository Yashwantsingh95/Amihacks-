const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide shelter name']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number] // [longitude, latitude] - explicitly selected by shelter user
    },
    address: { type: String, default: '' }
  },
  capacity: {
    type: Number,
    required: true,
    default: 100
  },
  currentOccupancy: {
    type: Number,
    default: 20
  },
  foodPreferences: {
    type: [String],
    default: ['Vegetarian', 'Cooked Meals', 'Bakery', 'All']
  },
  currentNeed: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'HIGH'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// GeoJSON 2dsphere index for real geospatial queries ($near, $geoNear)
shelterSchema.index({ location: '2dsphere' }, { sparse: true });

module.exports = mongoose.model('Shelter', shelterSchema);
