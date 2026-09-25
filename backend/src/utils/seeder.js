const mongoose = require('mongoose');
const User = require('../models/User');
const Shelter = require('../models/Shelter');
const Driver = require('../models/Driver');
const Donation = require('../models/Donation');
const Rescue = require('../models/Rescue');
const Notification = require('../models/Notification');
const { getRealDirections } = require('../services/mapService');

const seedData = async () => {
  try {
    console.log('[Seeder] Checking and populating real GeoJSON demo data...');

    // Clear existing collections
    await User.deleteMany({});
    await Shelter.deleteMany({});
    await Driver.deleteMany({});
    await Donation.deleteMany({});
    await Rescue.deleteMany({});
    await Notification.deleteMany({});

    // 1. Create Donors (GeoJSON [lng, lat])
    const donor1 = await User.create({
      name: 'ABC Restaurant',
      email: 'donor@rescueflow.com',
      password: 'password123',
      role: 'DONOR',
      authProvider: 'LOCAL',
      location: {
        type: 'Point',
        coordinates: [77.2197, 28.6328], // [lng, lat] Connaught Place
        address: 'Connaught Place, New Delhi'
      }
    });

    const donor2 = await User.create({
      name: 'XYZ Cafeteria',
      email: 'xyz@rescueflow.com',
      password: 'password123',
      role: 'DONOR',
      authProvider: 'LOCAL',
      location: {
        type: 'Point',
        coordinates: [77.2090, 28.6139],
        address: 'Barakhamba Road, New Delhi'
      }
    });

    // 2. Create Shelters
    const shelterUser1 = await User.create({
      name: 'Shelter A (Hope Foundation)',
      email: 'shelter@rescueflow.com',
      password: 'password123',
      role: 'SHELTER',
      authProvider: 'LOCAL',
      location: {
        type: 'Point',
        coordinates: [77.1906, 28.6448], // Karol Bagh
        address: 'Plot 14, Karol Bagh, New Delhi'
      }
    });

    const shelterUser2 = await User.create({
      name: 'Shelter B (Seva Community Kitchen)',
      email: 'shelterb@rescueflow.com',
      password: 'password123',
      role: 'SHELTER',
      authProvider: 'LOCAL',
      location: {
        type: 'Point',
        coordinates: [77.2155, 28.6507], // Paharganj
        address: 'Paharganj, New Delhi'
      }
    });

    const shelterUser3 = await User.create({
      name: 'Shelter C (Jan Kalyan Home)',
      email: 'shelterc@rescueflow.com',
      password: 'password123',
      role: 'SHELTER',
      authProvider: 'LOCAL',
      location: {
        type: 'Point',
        coordinates: [77.2218, 28.6863], // Civil Lines
        address: 'Civil Lines, New Delhi'
      }
    });

    const shelterA = await Shelter.create({
      userId: shelterUser1._id,
      name: 'Shelter A',
      location: shelterUser1.location,
      capacity: 120,
      currentOccupancy: 35,
      foodPreferences: ['Vegetarian', 'Cooked Meals', 'Bakery', 'All'],
      currentNeed: 'HIGH'
    });

    const shelterB = await Shelter.create({
      userId: shelterUser2._id,
      name: 'Shelter B',
      location: shelterUser2.location,
      capacity: 80,
      currentOccupancy: 40,
      foodPreferences: ['Vegetarian', 'Rice & Dal', 'All'],
      currentNeed: 'MEDIUM'
    });

    const shelterC = await Shelter.create({
      userId: shelterUser3._id,
      name: 'Shelter C',
      location: shelterUser3.location,
      capacity: 150,
      currentOccupancy: 110,
      foodPreferences: ['Packaged Food', 'Dairy', 'All'],
      currentNeed: 'HIGH'
    });

    // 3. Create Drivers
    const driverUser1 = await User.create({
      name: 'Rahul',
      email: 'driver@rescueflow.com',
      password: 'password123',
      role: 'DRIVER',
      authProvider: 'LOCAL',
      location: {
        type: 'Point',
        coordinates: [77.2120, 28.6360],
        address: 'Central Delhi'
      }
    });

    const driverUser2 = await User.create({
      name: 'Aman',
      email: 'aman@rescueflow.com',
      password: 'password123',
      role: 'DRIVER',
      authProvider: 'LOCAL',
      location: {
        type: 'Point',
        coordinates: [77.2050, 28.6250],
        address: 'Patel Nagar'
      }
    });

    const driverUser3 = await User.create({
      name: 'Priya',
      email: 'priya@rescueflow.com',
      password: 'password123',
      role: 'DRIVER',
      authProvider: 'LOCAL',
      location: {
        type: 'Point',
        coordinates: [77.2300, 28.6500],
        address: 'Old Delhi'
      }
    });

    const driverRahul = await Driver.create({
      userId: driverUser1._id,
      name: 'Rahul',
      phone: '+91 98765 43210',
      vehicle: 'Hero Electric Eco-Van (DL-01-EV-4289)',
      location: driverUser1.location,
      availability: 'AVAILABLE',
      completedRescuesCount: 142
    });

    const driverAman = await Driver.create({
      userId: driverUser2._id,
      name: 'Aman',
      phone: '+91 98112 23344',
      vehicle: 'Ather 450X Cargo Bike',
      location: driverUser2.location,
      availability: 'AVAILABLE',
      completedRescuesCount: 98
    });

    const driverPriya = await Driver.create({
      userId: driverUser3._id,
      name: 'Priya',
      phone: '+91 98223 34455',
      vehicle: 'Tata Ace EV Mini Truck',
      location: driverUser3.location,
      availability: 'AVAILABLE',
      completedRescuesCount: 115
    });

    // 4. Create Donations with real urgency levels
    const now = Date.now();

    // Live Biryani (2 hours remaining) -> ON_THE_WAY
    const donation1 = await Donation.create({
      donorId: donor1._id,
      foodType: 'Veg Biryani',
      category: 'Vegetarian',
      quantity: 40,
      unit: 'meals',
      pickupLocation: donor1.location,
      safeUntil: new Date(now + 2 * 60 * 60 * 1000), // 2 hours
      notes: 'Freshly prepared for banquet, packed in insulated containers.',
      status: 'ON_THE_WAY',
      shelterId: shelterA._id,
      driverId: driverRahul._id
    });

    // Paneer Rice (48 minutes remaining) -> MATCHED
    const donation2 = await Donation.create({
      donorId: donor1._id,
      foodType: 'Paneer Rice & Rotis',
      category: 'Vegetarian',
      quantity: 25,
      unit: 'meals',
      pickupLocation: donor1.location,
      safeUntil: new Date(now + 48 * 60 * 1000), // 48 minutes
      notes: 'Packed hot in foil containers.',
      status: 'MATCHED',
      shelterId: shelterB._id
    });

    // Packaged Food (18 minutes remaining - URGENT) -> POSTED
    const donation3 = await Donation.create({
      donorId: donor2._id,
      foodType: 'Packaged Fresh Meals',
      category: 'Vegetarian',
      quantity: 60,
      unit: 'meals',
      pickupLocation: donor2.location,
      safeUntil: new Date(now + 18 * 60 * 1000), // 18 minutes URGENT
      notes: 'Must be collected immediately.',
      status: 'POSTED'
    });

    // Delivered past donation for impact
    const donation4 = await Donation.create({
      donorId: donor1._id,
      foodType: 'Dal Makhani & Steamed Rice',
      category: 'Vegetarian',
      quantity: 50,
      unit: 'meals',
      pickupLocation: donor1.location,
      safeUntil: new Date(now - 30 * 60 * 1000),
      notes: 'Completed earlier today.',
      status: 'DELIVERED',
      shelterId: shelterA._id,
      driverId: driverRahul._id
    });

    // Compute real road directions for active rescue
    const roadRoute = await getRealDirections(donor1.location.coordinates, shelterA.location.coordinates);

    // 5. Create Rescue records
    await Rescue.create({
      donationId: donation1._id,
      donorId: donor1._id,
      shelterId: shelterA._id,
      driverId: driverRahul._id,
      status: 'ON_THE_WAY',
      distance: roadRoute.distanceKm,
      estimatedTime: roadRoute.durationMinutes,
      routeCoordinates: roadRoute.coordinates,
      lastDriverLocation: {
        coordinates: [77.2050, 28.6380],
        updatedAt: new Date()
      },
      matchedAt: new Date(now - 25 * 60 * 1000),
      acceptedAt: new Date(now - 20 * 60 * 1000),
      pickedUpAt: new Date(now - 10 * 60 * 1000)
    });

    await Rescue.create({
      donationId: donation2._id,
      donorId: donor1._id,
      shelterId: shelterB._id,
      status: 'MATCHED',
      distance: 3.4,
      estimatedTime: 12,
      matchedAt: new Date(now - 15 * 60 * 1000)
    });

    await Rescue.create({
      donationId: donation4._id,
      donorId: donor1._id,
      shelterId: shelterA._id,
      driverId: driverRahul._id,
      status: 'DELIVERED',
      distance: 2.1,
      estimatedTime: 8,
      matchedAt: new Date(now - 120 * 60 * 1000),
      acceptedAt: new Date(now - 110 * 60 * 1000),
      pickedUpAt: new Date(now - 90 * 60 * 1000),
      deliveredAt: new Date(now - 45 * 60 * 1000)
    });

    // Driver state
    driverRahul.availability = 'BUSY';
    driverRahul.activeDonationId = donation1._id;
    await driverRahul.save();

    // 6. Create Seed Notifications
    await Notification.create({
      userId: donor1._id,
      title: 'Active Rescue Underway',
      message: 'Driver Rahul is on the way to Shelter A with your Veg Biryani donation.',
      type: 'ON_THE_WAY',
      link: `/donor/tracking/${donation1._id}`
    });

    console.log('[Seeder] Demo seed data successfully loaded with real GeoJSON coordinates!');
  } catch (error) {
    console.error('[Seeder Error]', error);
  }
};

const clearAllData = async () => {
  try {
    console.log('[Database] Clearing all collections...');
    await User.deleteMany({});
    await Shelter.deleteMany({});
    await Driver.deleteMany({});
    await Donation.deleteMany({});
    await Rescue.deleteMany({});
    await Notification.deleteMany({});
    console.log('[Database] All demo data successfully wiped! Database is clean and empty.');
  } catch (error) {
    console.error('[Database Clear Error]', error);
  }
};

module.exports = { seedData, clearAllData };

