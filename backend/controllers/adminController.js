const Booking = require('../models/Booking');

const getAllBookings = async (req, res) => {
  try {
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