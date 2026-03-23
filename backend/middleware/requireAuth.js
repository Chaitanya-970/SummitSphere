const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => { // <--- Make sure 'next' is here!
  // 1. Verify Authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // Split "Bearer <token>" to get just the token
  const token = authorization.split(' ')[1];

  try {
    // 2. Verify the token
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the user to the request so controllers can use it
    // Include email so admin authorization checks can work.
    req.user = await User.findOne({ _id }).select('_id name email');
    
    // 4. Move to the next function (The Controller)
    next(); 

  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;