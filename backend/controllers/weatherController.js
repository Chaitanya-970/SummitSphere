const axios = require('axios');

const getTrekWeather = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Mission coordinates missing." });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    // Take the FIRST entry for each unique calendar date.
    // This always includes today regardless of what time it is,
    // because there will always be at least one future 3-hour slot for today.
    const seen = new Set();
    const dailyData = response.data.list.filter(entry => {
      const date = entry.dt_txt.split(' ')[0]; // "YYYY-MM-DD"
      if (!seen.has(date)) {
        seen.add(date);
        return true;
      }
      return false;
    });

    // Return exactly 5 days
    res.status(200).json(dailyData.slice(0, 5));
  } catch (error) {
    console.error("Weather API Error:", error.message);
    res.status(500).json({ error: "Weather data unavailable." });
  }
};

module.exports = { getTrekWeather };
