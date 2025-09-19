// src/components/NpkRecommendation.jsx
// ✅ CHANGE: New UI component to input pH, area (acres) and crop and call /api/npk-recommendation

import { useState } from "react";

const KNOWN_CROPS = ["Rice","Wheat","Maize","Sugarcane","Groundnut","Cotton","Soybean","Pulses"];

export default function NpkRecommendation() {
  const [pH, setPH] = useState("");
  const [area, setArea] = useState("");       // acres
  const [crop, setCrop] = useState("Rice");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setResult(null);

    const pHv = parseFloat(pH);
    const areaV = parseFloat(area);
    if (isNaN(pHv) || isNaN(areaV) || !crop) {
      setErr("Please enter numeric pH and area, and choose a crop.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://smart-crop-advisory-backend.onrender.com/api/npk-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pH: pHv, area_acres: areaV, crop })
      });
      const json = await res.json();
      setResult(json);
    } catch (e) {
      console.error(e);
      setErr("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">NPK Recommendation (simple)</h3>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Soil pH</label>
          <input type="number" step="0.1" value={pH} onChange={(e)=>setPH(e.target.value)}
            className="w-full border p-2 rounded" placeholder="e.g. 6.5" />
        </div>

        <div>
          <label className="block text-sm mb-1">Area (acres)</label>
          <input type="number" step="0.01" value={area} onChange={(e)=>setArea(e.target.value)}
            className="w-full border p-2 rounded" placeholder="e.g. 1.0" />
        </div>

        <div>
          <label className="block text-sm mb-1">Crop</label>
          <select value={crop} onChange={(e)=>setCrop(e.target.value)} className="w-full border p-2 rounded">
            {KNOWN_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? "Calculating..." : "Get NPK Recommendation"}
          </button>
        </div>
      </form>

      {err && <p className="text-red-600 mt-3">{err}</p>}

      {result && result.success && (
        <div className="mt-4 bg-gray-50 p-3 rounded">
          <h4 className="font-semibold">Recommendation for {result.crop} — Area: {result.area_acres} acre(s)</h4>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded shadow">
              <h5 className="font-medium">Per acre (kg)</h5>
              <p>N: {result.per_acre.N_kg_per_acre} kg/acre</p>
              <p>P: {result.per_acre.P_kg_per_acre} kg/acre</p>
              <p>K: {result.per_acre.K_kg_per_acre} kg/acre</p>
              <p className="font-semibold">Total: {result.per_acre.total_per_acre} kg/acre</p>
            </div>
            <div className="p-3 bg-white rounded shadow">
              <h5 className="font-medium">Total for field (kg)</h5>
              <p>N: {result.total_for_field_kg.N_total_kg} kg</p>
              <p>P: {result.total_for_field_kg.P_total_kg} kg</p>
              <p>K: {result.total_for_field_kg.K_total_kg} kg</p>
              <p className="font-semibold">Total: {result.total_for_field_kg.total_field} kg</p>
            </div>
          </div>

          <div className="mt-3">
            <h5 className="font-medium">N split suggestion (field total)</h5>
            <p>Basal: {result.N_split_for_field_kg.basal_kg} kg · Mid: {result.N_split_for_field_kg.mid_kg} kg · Final: {result.N_split_for_field_kg.final_kg} kg</p>
          </div>

          <div className="mt-3">
            <h5 className="font-medium">Notes</h5>
            <ul className="list-disc pl-5">
              {result.notes.map((n,i)=><li key={i}>{n}</li>)}
            </ul>
            <div className="mt-2">
              {result.advice.map((a,i)=><p key={i}>• {a}</p>)}
            </div>
          </div>
        </div>
      )}

      {result && !result.success && <p className="text-red-600 mt-3">Error: {result.error}</p>}
    </div>
  );
}
