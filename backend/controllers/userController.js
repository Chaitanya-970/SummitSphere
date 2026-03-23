const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const{sendWelcomeEmail} = require('../utils/emailService'); // 9 CGPA: Email utility
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};
const crypto = require('crypto');
const{sendResetEmail} = require('../utils/emailService'); // 9 CGPA: Email utility
// Error handler (Unchanged, kept for logic)
const handleErrors = (err) => {
  let errors = { name: '', email: '', password: '' };

  if (err.message === 'All fields must be filled') {
    errors.name = 'Name is required';
    errors.email = 'Email is required';
    errors.password = 'Password is required';
    return errors;
  }

  if (err.message === 'Email already in use') {
    errors.email = 'That email is already registered';
    return errors;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    if (field === 'email') errors.email = 'That email is already registered';
    return errors;
  }
  if (err.message === 'Incorrect email') {
    errors.email = 'That email is not registered';
    return errors;
  }
  if (err.message === 'Incorrect password') {
    errors.password = 'That password is incorrect';
    return errors;
  }
  if (err.message && err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    return errors;
  }
  return errors;
};

// LOGIN USER - FIXED TO INCLUDE ROLE & AVATAR
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw Error('Incorrect email');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw Error('Incorrect password');

    const token = createToken(user._id);

    // 9 CGPA FIX: Include EVERYTHING the frontend needs
    res.status(200).json({ 
      name: user.name, 
      email: user.email, 
      token, 
      id: user._id, 
      role: user.role, // This makes /admin work
      profilePicture: user.profilePicture // This makes the Navbar work
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// SIGNUP USER - FIXED TO INCLUDE ROLE & AVATAR
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // 1. Create the user
    const user = await User.signup(name, email, password);
    const token = createToken(user._id);

    // 2. 9 CGPA: Fire the email trigger silently in the background
    sendWelcomeEmail(user.email, user.name).catch(err => console.error("Welcome Email Failed:", err));

    // 3. Send the final response to the frontend
    res.status(200).json({ 
      name: user.name, 
      email: user.email, 
      token, 
      id: user._id, 
      role: user.role, 
      profilePicture: user.profilePicture 
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve profile" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please select an image to upload" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: req.file.path },
      { new: true }
    ).select('-password');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Avatar upload failed" });
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "That email is not registered" });
    }


    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();
// Replace the hardcoded string with the variable
const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendResetEmail(user.email, user.name, resetUrl);


    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    // Reset fields if anything fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
};

const resetPassword = async (req, res) => {
  // 1. Grab the 'Guest Key' from the URL and the New Password from the form
  const { token } = req.params;
  const { password } = req.body;

  try {
    // 2. Hash the token from the URL to match the one in our database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 3. Find the explorer whose token matches AND hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() } // $gt = Greater Than (Clock check)
    });

    if (!user) {
      return res.status(400).json({ error: "Access Key invalid or expired. Request a new transmission." });
    }

    // 4. Update the password (Model middleware will hash this automatically)
    user.password = password;

    // 5. MISSION SUCCESS: Clear the recovery fields so they can't be used again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // 6. Optional: Send a confirmation email (Mission Restored)
    // sendConfirmationEmail(user.email, user.name); 

    res.status(200).json({ message: "Access Protocol Restored. You may now log in with your new credentials." });
  } catch (error) {
    res.status(500).json({ error: "Encryption error. Password update failed." });
  }
};

module.exports = { signupUser, loginUser, getUserProfile, updateAvatar, forgotPassword, resetPassword };