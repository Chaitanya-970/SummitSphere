const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  trekId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trek', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  groupSize: { type: Number, required: true },
  trekDate: { type: Date, required: true },
  email: { type: String },
  phone: { type: String },
  isCleared: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);