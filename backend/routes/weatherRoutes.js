const express = require('express');
const router = express.Router();
const { getTrekWeather } = require('../controllers/weatherController');

// This route will be: GET /api/weather?lat=XX&lon=YY
router.get('/', getTrekWeather);

module.exports = router;