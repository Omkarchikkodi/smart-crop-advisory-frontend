// src/components/WeatherCard.jsx
import { useEffect, useState } from "react";
import translations from "../translations";


const WeatherCard = ({ lang = "en" }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log(`${latitude} and ${longitude}`);
          fetch(`https://smart-crop-advisory-backend.onrender.com/api/weather?lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success) setWeather(data.data);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        },
        () => {
          // If GPS fails → fallback (backend auto Belgaum)
          fetch("https://smart-crop-advisory-backend.onrender.com/api/weather")
            .then((res) => res.json())
            .then((data) => {
              if (data.success) setWeather(data.data);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }
      );
    } else {
      // If GPS not supported → fallback
      fetch("https://smart-crop-advisory-backend.onrender.com/api/weather")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setWeather(data.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []);

  if (loading) return <p>{translations[lang]?.loading || "Loading..."}</p>;
  if (!weather) return <p>{translations[lang]?.error || "⚠️ Error fetching weather"}</p>;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-2">🌍 {weather.name}, {weather.sys?.country}</h2>
      <p>🌡️ {weather.main?.temp}°C</p>
      <p>☁️ {weather.weather?.[0]?.description}</p>
      <p>💧 {translations[lang]?.humidity || "Humidity"}: {weather.main?.humidity}%</p>
    </div>
  );
};

export default WeatherCard;
