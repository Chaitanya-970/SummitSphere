const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

// GET all bookmarks for the logged-in user
// Filter out bookmarks whose trek has been deleted (trekId populates as null)
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).populate('trekId');

    // Remove stale bookmarks where the trek no longer exists
    const valid = bookmarks.filter(b => b.trekId !== null);

    // Also clean up the stale ones from DB silently so they don't accumulate
    const staleIds = bookmarks.filter(b => b.trekId === null).map(b => b._id);
    if (staleIds.length > 0) {
      await Bookmark.deleteMany({ _id: { $in: staleIds } });
    }

    res.status(200).json(valid);
  } catch (err) { res.status(400).json({ error: 'Radar failure' }); }
});

// POST a new bookmark
router.post('/', async (req, res) => {
  try {
    const bookmark = await Bookmark.create({ userId: req.user._id, trekId: req.body.trekId });
    res.status(200).json(bookmark);
  } catch (err) { res.status(400).json({ error: 'Already bookmarked or system error' }); }
});

// DELETE a bookmark
router.delete('/:trekId', async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ userId: req.user._id, trekId: req.params.trekId });
    res.status(200).json({ message: 'Removed' });
  } catch (err) { res.status(400).json({ error: 'Delete failed' }); }
});

module.exports = router;