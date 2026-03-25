const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).populate('trekId');

    const valid = bookmarks.filter(b => b.trekId !== null);

    const staleIds = bookmarks.filter(b => b.trekId === null).map(b => b._id);
    if (staleIds.length > 0) {
      await Bookmark.deleteMany({ _id: { $in: staleIds } });
    }

    res.status(200).json(valid);
  } catch (err) { res.status(400).json({ error: 'Radar failure' }); }
});


router.post('/', async (req, res) => {
  try {
    const bookmark = await Bookmark.create({ userId: req.user._id, trekId: req.body.trekId });
    res.status(200).json(bookmark);
  } catch (err) { res.status(400).json({ error: 'Already bookmarked or system error' }); }
});


router.delete('/:trekId', async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ userId: req.user._id, trekId: req.params.trekId });
    res.status(200).json({ message: 'Removed' });
  } catch (err) { res.status(400).json({ error: 'Delete failed' }); }
});

module.exports = router;