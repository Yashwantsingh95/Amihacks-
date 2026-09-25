const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  },
  address: { type: String, default: '' },
  accuracy: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function () {
      return this.authProvider === 'LOCAL';
    }
  },
  authProvider: {
    type: String,
    enum: ['LOCAL', 'GOOGLE'],
    default: 'LOCAL'
  },
  googleId: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['DONOR', 'SHELTER', 'DRIVER'],
    required: true
  },
  location: {
    type: pointSchema,
    default: undefined
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// GeoJSON 2dsphere index for location queries
userSchema.index({ location: '2dsphere' }, { sparse: true });

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Exclude password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
