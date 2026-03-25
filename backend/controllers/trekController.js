const Trek = require('../models/Trek');
const mongoose = require('mongoose');
const {sendTrekCreationEmail} = require('../utils/emailService');
const createTrek = async (req, res) => {
  const { name, state, difficulty, duration, maxAltitude, description, itinerary, geometry } = req.body;

  let imageUrl = "";
  if (req.file) {
    imageUrl = req.file.path; 
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }

  if (!imageUrl) {
    return res.status(400).json({ error: "Please upload an image for your expedition" });
  }

  try {
    const user_id = req.user._id;
    
    const trek = await Trek.create({
      name, state, difficulty, duration, maxAltitude, 
      description, imageUrl, user_id, itinerary, geometry,
      isModerated: false
    });

    sendTrekCreatedEmail(req.user.email, trek.name).catch(err => console.error("Trek Email Failed:", err));

    res.status(200).json(trek);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTreks = async (req, res) => {
  try {
    const { name, difficulty, state, duration, lat, lng, sort } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (difficulty) query.difficulty = difficulty;
    if (state) query.state = state;

    if (duration === 'short') query.duration = { $lte: 3 };
    if (duration === 'medium') query.duration = { $gte: 4, $lte: 7 };
    if (duration === 'long') query.duration = { $gte: 8 };

    let trekQuery;

    if (lat && lng && lat !== 'null' && lng !== 'null') {
      query.geometry = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 1000000 
        }
      };
      trekQuery = Trek.find(query).populate('user_id', 'name');
    } else {
      trekQuery = Trek.find(query).populate('user_id', 'name');

      if (sort === 'alt-high') trekQuery = trekQuery.sort({ maxAltitude: -1 });
      else if (sort === 'alt-low') trekQuery = trekQuery.sort({ maxAltitude: 1 });
      else if (sort === 'dur-long') trekQuery = trekQuery.sort({ duration: -1 });
      else if (sort === 'dur-short') trekQuery = trekQuery.sort({ duration: 1 });
      else trekQuery = trekQuery.sort({ createdAt: -1 });
    }

    const treks = await trekQuery;
    res.status(200).json(treks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTrek = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such trek exists' });
  }
  const trek = await Trek.findById(id).populate('user_id', 'name');
  if (!trek) {
    return res.status(404).json({ error: 'No such trek exists' });
  }
  res.status(200).json(trek);
};

const deleteTrek = async (req, res) => {
  const { id } = req.params;
  try {
    const trek = await Trek.findById(id);
    if (!trek) return res.status(404).json({ error: 'Trek not found' });

    const isOwner = trek.user_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized: Mission credentials invalid.' });
    }

    await Trek.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expedition terminated.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTrek = async (req, res) => {
  const { id } = req.params;
  try {
    const trek = await Trek.findById(id);
    if (!trek) return res.status(404).json({ error: 'Trek not found' });

    const isOwner = trek.user_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedTrek = await Trek.findByIdAndUpdate(id, { ...req.body }, { new: true });
    res.status(200).json(updatedTrek);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTrek,
  getTrek,
  getTreks,
  deleteTrek,
  updateTrek
};