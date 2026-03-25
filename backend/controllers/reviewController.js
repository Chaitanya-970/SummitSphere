const Review = require('../models/Review');

const createReview = async (req, res) => {
  try {
    const { trekId, rating, comment, userName } = req.body;
    if (!trekId) return res.status(400).json({ error: 'trekId is required' });

    const photoUrls = req.files ? req.files.map(file => file.path) : [];

    const review = await Review.create({
      trekId,
      userId: req.user._id,
      userName: userName || req.user.name,
      rating: Number(rating),
      comment: comment || "",
      photos: photoUrls,
      isReported: false 
    });

    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getReportedReviews = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    
    const reported = await Review.find({ isReported: true })
      .populate('trekId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(reported);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getReviewsByTrek = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ trekId: id }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { isReported: true }, { new: true });
    res.status(200).json({ message: "Review flagged for Command Centre review.", review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resolveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { isReported: false }, { new: true });
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) return res.status(404).json({ error: 'Review not found' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = review.userId && review.userId.toString() === req.user._id.toString();

    if (isAdmin && !isOwner) {
      // Admin is not the owner: CAN ONLY DELETE IF REPORTED
      if (!review.isReported) {
        return res.status(403).json({ 
          error: 'Commander Overreach: Admins can only delete reviews flagged by the community.' 
        });
      }
    } else if (!isOwner) {
      // Not an Admin and not the Owner: BLOCKED
      return res.status(403).json({ error: 'Unauthorized: Mission credentials invalid.' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review successfully nuked.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByTrek,
  getReportedReviews,
  reportReview,
  resolveReview,
  deleteReview
};