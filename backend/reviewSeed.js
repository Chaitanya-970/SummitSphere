require('dotenv').config();
const mongoose = require('mongoose');
const Trek = require('./models/Trek');
const User = require('./models/User');
const Review = require('./models/Review');

const namesPool = [
  "Arjun Kapoor", "Sanya Malhotra", "Rohan Mehra", "Priya Das",
  "Vikram Singh", "Aditi Rao", "Kabir Thapar", "Ishani Krishnan",
  "Rahul Sharma", "Meera Nair", "Zoya Ahmed", "Amitabh Verma",
  "Devika Pillai", "Siddharth Joshi", "Ananya Bose", "Nikhil Chadha",
];

const commentsPool = [
  { rating: 5, comment: "The summit push was brutal but the 360-degree view made every single step worth it. Don't forget your gaiters!" },
  { rating: 4, comment: "Incredible terrain transitions — from pine forests to alpine meadows in just two days. The guide was absolutely top-notch." },
  { rating: 5, comment: "Be prepared for cold nights. My -10°C bag was barely enough, but watching the sunrise from high camp was genuinely spiritual." },
  { rating: 3, comment: "Beautiful trail but quite crowded near the basecamp. Waste management seriously needs to improve — bring your own trash bags." },
  { rating: 5, comment: "A true test of endurance. Crossing the high pass was technical and thrilling. A dream for experienced hikers wanting a real challenge." },
  { rating: 4, comment: "The hospitality in the mountain villages we passed through was the real highlight. Locals are incredibly warm and generous." },
  { rating: 5, comment: "Crystal-clear skies all week. I captured the Milky Way perfectly from my tent on night three. An absolute photographer's paradise." },
  { rating: 4, comment: "Steady ascent throughout. The final ridge walk is narrow but perfectly safe if you follow your guide's line. Breathtaking views." },
  { rating: 5, comment: "Best winter trek I've ever done. Snow-covered peaks stretching to the horizon look like something straight out of a film." },
  { rating: 4, comment: "Acclimatisation is everything. Don't rush the ascent or you'll spend the best viewpoints battling a headache. Take it slow." },
  { rating: 5, comment: "The glacial lake was half-frozen and shimmering like glass. Absolutely stunning. Worth every drop of sweat and every aching muscle." },
  { rating: 4, comment: "Food was surprisingly excellent at those altitudes. Wholesome hot meals after a long day — huge kudos to the kitchen team." },
  { rating: 5, comment: "Breathtaking views of the Kanchenjunga range in the early morning light. The rhododendron forests in bloom are simply magical." },
  { rating: 4, comment: "Day 3 is tough — a real grind — but the meadow campsite you're rewarded with is the most peaceful place I've ever slept." },
  { rating: 3, comment: "Trail was muddy due to unexpected rain. Your boots absolutely must be 100% waterproof. Mine weren't and I regretted every step." },
  { rating: 5, comment: "Solitude and silence. Exactly what I needed to fully disconnect from city life. Came back a completely different person." },
  { rating: 4, comment: "The river crossings were thrilling and a little sketchy, but the trek team handled every one with calm professionalism." },
  { rating: 5, comment: "The pass descent is a knee-breaker — use your trekking poles religiously. The sense of achievement at the bottom is immense." },
  { rating: 4, comment: "The pre-trek basecamp briefing was extremely thorough and detailed. Felt genuinely safe and well-prepared throughout." },
  { rating: 5, comment: "Life-changing. Standing among these giants, you realise how beautifully small you really are. I'll be back next year." },
];

// Exported so seed.js can call this directly after seeding treks,
// without opening a second DB connection.
const seedReviews = async () => {
  const user = await User.findOne();
  if (!user) throw new Error("Register an account on the website first!");

  const treks = await Trek.find({});
  if (treks.length === 0) throw new Error("No treks found. Run the trek seeder first!");

  console.log("🧹 Clearing old reviews...");

  const allReviews = [];
  treks.forEach(trek => {
    const numReviews = Math.floor(Math.random() * 3) + 2;
    const shuffledComments = [...commentsPool].sort(() => 0.5 - Math.random());
    const shuffledNames    = [...namesPool].sort(() => 0.5 - Math.random());
    for (let i = 0; i < numReviews; i++) {
      allReviews.push({
        trekId:     trek._id,
        userId:     user._id.toString(), // Schema expects String — do not change
        userName:   shuffledNames[i % shuffledNames.length],
        rating:     shuffledComments[i].rating,
        comment:    shuffledComments[i].comment,
        photos:     [],
        isReported: false,
        createdAt:  new Date(Date.now() - Math.floor(Math.random() * 7_776_000_000)),
      });
    }
    console.log(`✍️  Added ${numReviews} reviews for: ${trek.name}`);
  });

  await Review.insertMany(allReviews);
  console.log(`\n🎉 ${allReviews.length} reviews seeded across ${treks.length} treks.`);
};

module.exports = { seedReviews };

// Run standalone when called directly: node reviewSeed.js
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => seedReviews())
    .then(() => process.exit(0))
    .catch(err => { console.error("🚨 Failed:", err.message); process.exit(1); });
}