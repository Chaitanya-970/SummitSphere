const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const trekRoutes = require('./routes/trekRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const adminRoutes = require('./routes/adminRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors());
app.use(express.json()); 


// --- 2. ROUTE REGISTRATION ---
// All logic is now handled inside these files. Clean and professional.
app.use('/api/user', userRoutes);
app.use('/api/treks', trekRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/weather', weatherRoutes);
// --- 3. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✓ System Online: Connected to MongoDB');
    // --- 4. SERVER START ---
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Basecamp Active on Port ${PORT}`));
  })
  .catch(err => {
    console.error('✗ Connection Error:', err);
    process.exit(1); // Kill the server if DB fails
  });