const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trekId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trek', required: true }
}, { timestamps: true });

bookmarkSchema.index({ userId: 1, trekId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);