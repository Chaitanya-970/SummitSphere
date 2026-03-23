const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getReviewsByTrek, 
  getReportedReviews, // Ensure this exists in controller
  reportReview, 
  resolveReview, 
  deleteReview 
} = require('../controllers/reviewController');
const requireAuth = require('../middleware/requireAuth');
const upload = require('../middleware/upload');

// 1. PUBLIC ROUTES
router.get('/trek/:id', getReviewsByTrek);

// 2. PROTECTED ROUTES (Login Required)
router.use(requireAuth);

router.post('/', upload.array('photos', 5), createReview);
router.patch('/:id/report', reportReview);

// 3. ADMIN ONLY ROUTES (Line 17 is likely here)
router.get('/reported', getReportedReviews); 
router.patch('/:id/resolve', resolveReview);
router.delete('/:id', deleteReview);

module.exports = router;