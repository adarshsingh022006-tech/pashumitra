import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind, Thermometer } from 'lucide-react';
import api from '../services/api';

export default function WeatherChip() {
  const [weather, setWeather] = useState({
    temp: 33,
    description: 'clear sky',
    humidity: 62,
    wind_speed: 12
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/weather?lat=30.9010&lng=75.8572')
      .then((res) => {
        if (res.data.weather) {
          setWeather(res.data.weather);
        }
      })
      .catch((e) => console.warn('Weather fetch error:', e))
      .finally(() => setLoading(false));
  }, []);

  const getWeatherIcon = (desc = '') => {
    const d = desc.toLowerCase();
    if (d.includes('rain')) return <CloudRain size={16} className="text-blue-500" />;
    if (d.includes('cloud')) return <Cloud size={16} className="text-slate-500" />;
    if (d.includes('wind')) return <Wind size={16} className="text-teal-500" />;
    return <Sun size={16} className="text-amber-500" />;
  };

  return (
    <div
      title={`Humidity: ${weather.humidity}% | Wind: ${weather.wind_speed} km/h - Environmental context, not disease diagnosis`}
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/70 text-slate-700 text-xs font-medium shadow-xs select-none"
    >
      {getWeatherIcon(weather.description)}
      <span className="font-semibold text-slate-800">{weather.temp}°C</span>
      <span className="capitalize text-slate-600 hidden md:inline">{weather.description}</span>
      <span className="text-[10px] text-amber-700 font-mono hidden lg:inline ml-1">Ludhiana</span>
    </div>
  );
}
