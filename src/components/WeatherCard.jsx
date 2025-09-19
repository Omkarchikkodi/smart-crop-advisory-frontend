// src/components/WeatherCard.jsx
import { useEffect, useState } from "react";
import translations from "../translations";


// function WeatherCard({ translations, lang }) {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [coords, setCoords] = useState(null);

//   useEffect(() => {
//     // Get user's location
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setCoords({
//           lat: pos.coords.latitude,
//           lon: pos.coords.longitude,
//         });
//       },
//       (err) => {
//         console.error("GPS Error:", err);
//         // fallback: Belgaum coords
//         setCoords({ lat: 15.5, lon: 74.0 });
//       }
//     );
//   }, []);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const lat = pos.coords.latitude;
//         const lon = pos.coords.longitude;
//         fetch(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`)
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.success) setWeather(data.data);
//             setLoading(false);
//           })
//           .catch(() => setLoading(false));
//       },
//       (err) => {
//         console.error("GPS Error:", err);
//         // fallback: Belgaum
//         fetch(`http://localhost:5000/api/weather?lat=15.5&lon=74.0`)
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.success) setWeather(data.data);
//             setLoading(false);
//           })
//           .catch(() => setLoading(false));
//       }
//     );
//   }, []);


//   if (loading) return <p>{translations[lang].loading}</p>;
//   if (!weather) return <p>⚠️ Error fetching weather</p>;

//   return (
//     <div className="p-4 bg-green-100 rounded-xl shadow-md">
//       <h2 className="text-xl font-bold mb-2">🌤 {weather.weather[0].main}</h2>
//       <p>🌡 {weather.main.temp}°C</p>
//       <p>📍 Lat: {coords.lat.toFixed(2)}, Lon: {coords.lon.toFixed(2)}</p>
//     </div>
//   );
// }

// export default WeatherCard;


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
          fetch(`http://localhost:5000/api/weather?lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success) setWeather(data.data);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        },
        () => {
          // If GPS fails → fallback (backend auto Belgaum)
          fetch("http://localhost:5000/api/weather")
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
      fetch("http://localhost:5000/api/weather")
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
