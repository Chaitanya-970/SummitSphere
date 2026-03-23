require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Trek = require('./models/Trek');
const User = require('./models/User');
const { seedReviews } = require('./reviewSeed'); // <-- just import

const generatePath = (baseCoords, duration) => {
  const [lon, lat] = baseCoords;
  return Array.from({ length: duration }, (_, i) => {
    const offset = i * 0.005;
    return [lon + offset, lat + (offset * 0.7)];
  });
};

const seedDatabase = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
const existing = await Trek.countDocuments();
if (existing > 0) {
  console.log(`⚠️  ${existing} treks already in DB. Pass --force to reseed.`);
  if (!process.argv.includes('--force')) { process.exit(0); }
}
    const dataPath = path.join(__dirname, 'treksSeed.json');
    const treksData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const adminUser = await User.findOne();
    if (!adminUser) throw new Error("Register an account on the website first, then run this seeder.");

    // ── STEP 1: TREKS ──────────────────────────────────────────
    console.log("🧹 Clearing old trek data...");

    console.log(`🚀 Seeding ${treksData.length} treks with map paths...`);
    const treksToInsert = treksData.map(trek => {
      const pathCoords = generatePath(trek.geometry.coordinates, trek.duration);
      const updatedItinerary = trek.itinerary.map((day, index) => ({
        ...day,
        coordinates: pathCoords[index],
      }));
      return { ...trek, itinerary: updatedItinerary, user_id: adminUser._id };
    });

    await Trek.insertMany(treksToInsert);
    console.log(`✅ ${treksData.length} treks seeded.`);

    // ── STEP 2: REVIEWS (reuse reviewSeed logic, same connection) ──
    console.log("\n📝 Seeding reviews...");
    await seedReviews();

    console.log("\n🎉 Full database seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("🚨 Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();