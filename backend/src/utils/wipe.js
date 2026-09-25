const dotenv = require('dotenv');
dotenv.config();
const { connectDB } = require('../config/db');
const { clearAllData } = require('./seeder');

async function runWipe() {
  await connectDB();
  await clearAllData();
  process.exit(0);
}

runWipe();
