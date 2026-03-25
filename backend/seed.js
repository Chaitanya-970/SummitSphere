require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Trek = require('./models/Trek');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const treksData = JSON.parse(fs.readFileSync('./treksSeed.json', 'utf-8'));
    
    const admin = await User.findOne();
    if (!admin) throw new Error("Register a user on the site first.");

    await Trek.deleteMany({});
    
    const treks = treksData.map(t => ({
      ...t,
      user_id: admin._id,
      itinerary: t.itinerary.map((day, i) => ({
        ...day,

        coordinates: [t.geometry.coordinates[0] + (i * 0.01), t.geometry.coordinates[1] + (i * 0.01)]
      }))
    }));

    await Trek.insertMany(treks);
    console.log(` Success: ${treks.length} treks seeded.`);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedDatabase();