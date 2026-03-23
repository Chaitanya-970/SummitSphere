const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email address"
    }
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  profilePicture: {
    type: String,
    default: "https://res.cloudinary.com/dzj8q4m9c/image/upload/v1700000000/default-profile-picture.png"
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Static signup method — called by signupUser controller
// This was missing, causing every signup to crash with "User.signup is not a function"
userSchema.statics.signup = async function(name, email, password) {
  if (!name || !email || !password) throw Error('All fields must be filled');

  const exists = await this.findOne({ email });
  if (exists) throw Error('Email already in use');

  const user = await this.create({ name, email, password });
  return user;
};

module.exports = mongoose.model('User', userSchema);