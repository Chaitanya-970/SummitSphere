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
    default: "Trekker"
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
    default: ""
  }  ,
  photos: {
    type: [String],
    required: false,
    default: []
  },
  isReported: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);