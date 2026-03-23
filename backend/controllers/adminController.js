const Booking = require('../models/Booking');

// @desc    Get all bookings for the Admin Ledger
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    // 9 CGPA: Fetch everything and link (populate) the user and trek details
    const allBookings = await Booking.find({})
      .populate('userId', 'name email profilePicture')
      .populate('trekId', 'name maxAltitude')
      .sort({ createdAt: -1 });

    res.status(200).json(allBookings);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve global ledger." });
  }
};

module.exports = { getAllBookings };