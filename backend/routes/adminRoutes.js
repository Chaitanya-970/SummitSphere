const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Trek = require('../models/Trek');
const requireAuth = require('../middleware/requireAuth');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Access Denied: Commanders Only" });
  }
};

router.get('/bookings', requireAuth, adminOnly, async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate('trekId', 'name maxAltitude duration imageUrl') 
      .populate('userId', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(allBookings);
  } catch (error) {
    res.status(500).json({ error: "Satellite downlink failed for ledger data" });
  }
});

router.get('/treks/queue', requireAuth, adminOnly, async (req, res) => {
  try {
    const queue = await Trek.find({ 
      userId: { $ne: req.user._id },
      isModerated: false
    }).sort({ createdAt: -1 });

    res.status(200).json(queue);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch moderation queue" });
  }
});

router.patch('/treks/:id/clear', requireAuth, adminOnly, async (req, res) => {
  try {
    await Trek.findByIdAndUpdate(req.params.id, { isModerated: true });
    res.status(200).json({ message: "Expedition cleared from queue." });
  } catch (error) {
    res.status(400).json({ error: "Failed to clear trek." });
  }
});

router.delete('/treks/:id', requireAuth, adminOnly, async (req, res) => {
  try {
    await Trek.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expedition deleted globally." });
  } catch (error) {
    res.status(400).json({ error: "Global nuke failed." });
  }
});

router.get('/bookings', requireAuth, adminOnly, async (req, res) => {
  try {
    const activeBookings = await Booking.find({ isCleared: { $ne: true } })
      .populate('trekId', 'name maxAltitude duration imageUrl') 
      .populate('userId', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(activeBookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ledger" });
  }
});

router.patch('/bookings/:id/clear', requireAuth, adminOnly, async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { isCleared: true });
    res.status(200).json({ message: "Booking dismissed from ledger." });
  } catch (error) {
    res.status(400).json({ error: "Failed to clear booking." });
  }
});

module.exports = router;