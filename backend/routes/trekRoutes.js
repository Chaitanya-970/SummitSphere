const express = require('express');
const { getTreks, getTrek, createTrek, deleteTrek, updateTrek } = require('../controllers/trekController');
const requireAuth = require('../middleware/requireAuth');
const upload = require('../middleware/upload'); // Your Cloudinary middleware

const router = express.Router();

// 1. PUBLIC ROUTES (Anyone can see these)
router.get('/', getTreks);
router.get('/:id', getTrek);

// 2. THE BOUNCER (Everything below this requires a login)
router.use(requireAuth);

// 3. PROTECTED ROUTES
router.post('/', upload.single('image'), createTrek);
router.delete('/:id', deleteTrek);
router.patch('/:id', upload.single('image'), updateTrek);

module.exports = router;