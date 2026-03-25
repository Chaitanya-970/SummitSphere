const express = require('express');
const router = express.Router();
const { getTrekWeather } = require('../controllers/weatherController');

router.get('/', getTrekWeather);

module.exports = router;