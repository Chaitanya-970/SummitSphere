const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Trek = require('../models/Trek');
const requireAuth = require('../middleware/requireAuth');
const { sendBookingEmail } = require('../utils/emailService');

router.use(requireAuth);

router.post('/', async (req, res) => {
  const { trekId, fullName, groupSize, trekDate, email, phone } = req.body;

  try {
    const booking = await Booking.create({
      trekId,
      userId: req.user._id,
      fullName,
      groupSize,
      trekDate,
      email: email || req.user.email,
      phone,
    });

    const trek = await Trek.findById(trekId);
    const trekName = trek?.name || 'Your Expedition';

    sendBookingEmail(
      req.user.email,
      fullName || req.user.name,
      trekName,
      {
        duration:    trek?.duration,
        difficulty:  trek?.difficulty,
        maxAltitude: trek?.maxAltitude,
        trekDate:    trekDate,
        groupSize:   groupSize,
      }
    ).catch(err => console.error('Booking email failed:', err));

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Booking failed. Please try again.' });
  }
});

router.get('/my-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('trekId', 'name state maxAltitude duration imageUrl')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch bookings.' });
  }
});

module.exports = router;