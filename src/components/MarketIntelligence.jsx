// src/components/MarketIntelligence.jsx
import { useState } from "react";
import translations from "../translations";
import { useTranslation } from "react-i18next";

export default function MarketIntelligence({ lang }) {
  const [crop, setCrop] = useState("");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  // ✅ Updated: Fetch from backend route
  const handleFetch = async () => {
    if (!crop) {
      setError("Please select a crop");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // 🔹 CHANGE: endpoint renamed to /api/market/:crop (cleaner REST format)
      const res = await fetch(`https://smart-crop-advisory-backend.onrender.com/api/market/${encodeURIComponent(crop)}`);
      const json = await res.json();
      if (json.success && json.prices) {
        setPrices(json.prices); // ✅ correct key from backend
      } else {
        setError(json.error || "No data found");
      }
    } catch (e) {
      console.error(e);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">
        📊 {t("market.intelligence")}
      </h3>

      {/* Select crop input */}
      <div className="space-y-3">
        <select
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">{t("market.select_crop")}</option>
          <option value="Rice">{t("crops.rice")}</option>
          <option value="Wheat">{t("crops.wheat")}</option>
          <option value="Maize">{t("crops.maize")}</option>
          <option value="Groundnut">{t("crops.groundnut")}</option>
          <option value="Sugarcane">{t("crops.sugarcane")}</option>
          <option value="Cotton">{t("crops.cotton")}</option>
        </select>

        <button
          onClick={handleFetch}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? t("market.fetching") : t("market.get_prices")}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mt-3">{error}</p>}

      {/* Results Table */}
      {prices.length > 0 && (
        <table className="w-full mt-4 border">
          <thead>
            <tr className="bg-green-200">
              <th className="border p-2">{t("table.market")}</th>
              <th className="border p-2">{t("table.state")}</th>
              <th className="border p-2">{t("table.modal_price")}</th>
              <th className="border p-2">{t("table.min_price")}</th>
              <th className="border p-2">{t("table.max_price")}</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="border p-2">{p.mandi}</td>
                <td className="border p-2">{p.state}</td>
                <td className="border p-2">
                  {p.price_modal ? `₹${p.price_modal}` : "-"}
                </td>
                <td className="border p-2">
                  {p.price_min ? `₹${p.price_min}` : "-"}
                </td>
                <td className="border p-2">
                  {p.price_max ? `₹${p.price_max}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
