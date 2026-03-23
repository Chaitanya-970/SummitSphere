const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  trekId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trek', 
    required: true 
  },
  userId: {
    type: String,
    required: true
  },
  userName: { 
    type: String, 
    required: true,
    default: "Trekker" // We'll replace this with real Auth names later
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    maxlength: 1000,
    required: false,
    default: "" // Ensure it's never null/undefined
  }  ,
  photos: {
    type: [String], // Array of Cloudinary URLs
    required: false,
    default: [] // Default to empty array if no photos are uploaded
  },
  isReported: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);