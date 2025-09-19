// src/components/CropRecommendation.jsx
import { useState } from "react";
import axios from "axios";


function CropRecommendation() {
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [humidity, setHumidity] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ CHANGE: Get GPS location
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {
        // ✅ CHANGE: Fetch weather data from backend
        const weatherRes = await axios.get(
          `https://smart-crop-advisory-backend.onrender.com/api/weather?lat=${lat}&lon=${lon}`
        );

        const weatherData = {
          temp: weatherRes.data.data.main.temp,
          humidity: weatherRes.data.data.main.humidity,
          rainfall: weatherRes.data.data.rain
            ? weatherRes.data.data.rain["1h"] || 0
            : 0,
        };

        // ✅ CHANGE: Send soil + season + weather to recommendation API
        const res = await fetch("https://smart-crop-advisory-backend.onrender.com/api/recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ soilType, season, humidity, lat, lon }),
        });

        const data = await res.json();
        if (data.success) {
          setRecommendations(data.recommendation);
        }
      } catch (err) {
        console.error("Error in crop recommendation:", err);
      }
    });
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-3">🌱 Crop Recommendation</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          className="p-2 border rounded w-full"
          value={soilType}
          onChange={(e) => setSoilType(e.target.value)}
        >
          <option value="">Select Soil Type</option>
          <option value="clay">Clay</option>
          <option value="sandy">Sandy</option>
          <option value="loamy">Loamy</option>
        </select>

        <select
          className="p-2 border rounded w-full"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        >
          <option value="">Select Season</option>
          <option value="kharif">Kharif</option>
          <option value="rabi">Rabi</option>
          <option value="summer">Summer</option>
        </select>

        <input
          type="number"
          placeholder="Enter soil humidity %"
          className="p-2 border rounded w-full"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Get Recommendation
        </button>
      </form>

      {recommendations.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Recommended Crops:</h3>
          <ul className="list-disc pl-5">
            {recommendations.map((crop, i) => (
              <li key={i}>{crop}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CropRecommendation;
