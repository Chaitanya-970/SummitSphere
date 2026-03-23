const mongoose = require('mongoose');

const trekSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  state:        { type: String, required: true },
  difficulty:   { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  duration:     { type: Number, required: true },
  maxAltitude:  { type: Number },
  description:  { type: String },
  imageUrl:     { type: String },
  user_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Fields present in seed data — were silently dropped without these
  startPoint:   { type: String },
  endPoint:     { type: String },
  groupSize:    { type: String },
  rating:       { type: String },

  location: {
    type: { type: String, default: 'Point' },
    coordinates: { lat: Number, lng: Number }
  },

  itinerary: [{
    day:          { type: Number, required: true },
    title:        { type: String, required: true },
    description:  { type: String },
    locationName: { type: String },
    coordinates:  { type: [Number], required: true } // [longitude, latitude]
  }],

  geometry: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },

  isModerated: { type: Boolean, default: false },
}, { timestamps: true });

trekSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Trek', trekSchema);
