const https = require('https');

// In-memory cache for coordinates: key = `${lat.toFixed(2)},${lng.toFixed(2)}`
const weatherCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Fetch weather via OpenWeatherMap API or realistic mock fallback
 */
async function getWeather(lat = 30.9010, lng = 75.8572) {
  const latitude = parseFloat(lat) || 30.9010;
  const longitude = parseFloat(lng) || 75.8572;
  const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;

  const cached = weatherCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey) {
    try {
      const liveData = await fetchFromOpenWeather(latitude, longitude, apiKey);
      if (liveData) {
        weatherCache.set(cacheKey, { timestamp: Date.now(), data: liveData });
        return liveData;
      }
    } catch (err) {
      console.warn('[Weather Service] OpenWeatherMap request failed, falling back to realistic simulation:', err.message);
    }
  }

  // Realistic mock Punjab weather
  const mockWeather = generateMockWeather(latitude, longitude);
  weatherCache.set(cacheKey, { timestamp: Date.now(), data: mockWeather });
  return mockWeather;
}

function fetchFromOpenWeather(lat, lng, key) {
  return new Promise((resolve, reject) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}&units=metric`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const parsed = JSON.parse(data);
            resolve({
              temp: Math.round(parsed.main.temp),
              humidity: parsed.main.humidity,
              wind_speed: Math.round(parsed.wind.speed * 3.6), // convert to km/h
              clouds: parsed.clouds.all,
              description: parsed.weather[0]?.description || 'clear sky',
              icon: parsed.weather[0]?.icon || '01d',
              city: parsed.name || 'Ludhiana Region',
              is_mock: false
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function generateMockWeather(lat, lng) {
  // Deterministic slight variation based on coordinates
  const latOffset = Math.sin(lat * 10) * 2;
  const lngOffset = Math.cos(lng * 10) * 3;
  const temp = Math.round(32 + latOffset);
  const humidity = Math.min(85, Math.max(45, Math.round(58 + lngOffset * 2)));
  const wind_speed = Math.round(11 + Math.abs(latOffset) * 2);

  const descriptions = [
    'clear sky',
    'partly cloudy',
    'haze',
    'scattered clouds',
    'mostly sunny'
  ];
  const descIndex = Math.abs(Math.round(lat + lng)) % descriptions.length;

  return {
    temp,
    humidity,
    wind_speed,
    clouds: 20,
    description: descriptions[descIndex],
    icon: '01d',
    city: 'Ludhiana District',
    is_mock: true,
    environmental_notice: 'Weather is shown as environmental context, not a disease diagnosis.'
  };
}

module.exports = {
  getWeather
};
