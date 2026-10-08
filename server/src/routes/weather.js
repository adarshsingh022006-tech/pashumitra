const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weatherService');

// GET /api/weather
router.get('/', async (req, res) => {
  try {
    const lat = req.query.lat || 30.9010;
    const lng = req.query.lng || 75.8572;
    const weather = await getWeather(lat, lng);
    res.json({ weather });
  } catch (err) {
    console.error('[Weather GET Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

module.exports = router;
