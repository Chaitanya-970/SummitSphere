const express = require('express');
const { loginUser, signupUser, getUserProfile, updateAvatar, forgotPassword, resetPassword } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/profile', requireAuth, getUserProfile);

// Accept both PUT and PATCH — frontend sends PATCH, keeping PUT for backward compat
router.put('/update-avatar', requireAuth, upload.single('image'), updateAvatar);
router.patch('/update-avatar', requireAuth, upload.single('image'), updateAvatar);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
