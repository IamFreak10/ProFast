// src/components/MapView.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🛠 Marker icon fix for Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png?url';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png?url';

const DefaultIcon = new L.Icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// ✅ Auto zoom map on filtered locations
function FitBoundsHandler({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    const bounds = L.latLngBounds(
      locations.map((loc) => [loc.latitude, loc.longitude])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [locations, map]);

  return null;
}

export default function MapView() {
  const [allBranchLocations, setAllBranchLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Fetch branch data
  useEffect(() => {
    fetch('/branchLocations.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAllBranchLocations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Failed to load branch data.');
        setLoading(false);
      });
  }, []);

  // 🔍 Filtered data
  const filteredBranchLocations = useMemo(() => {
    if (!searchTerm) return allBranchLocations;
    const term = searchTerm.toLowerCase();
    return allBranchLocations.filter(
      (branch) =>
        branch.district.toLowerCase().includes(term) ||
        branch.city.toLowerCase().includes(term) ||
        (branch.covered_area &&
          branch.covered_area.some((area) =>
            area.toLowerCase().includes(term)
          ))
    );
  }, [allBranchLocations, searchTerm]);

  // 🔦 Highlight matching text
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-red-500 font-semibold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // 🧭 Conditional Renders
  if (loading) return <p className="p-4 text-gray-500">Loading map data...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-md border border-gray-200">
      {/* 🔍 Search Input */}
      <div className="absolute top-4 left-70 z-[1000] p-2 bg-white rounded-md shadow-lg flex items-center space-x-2 max-w-xs w-[90%]">
        <input
          type="text"
          placeholder="Search district, city or covered area..."
          className="p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* 🔔 No Results */}
      {filteredBranchLocations.length === 0 && (
        <div className="absolute top-20 left-4 z-[1000] bg-white p-2 rounded shadow text-gray-600">
          No results found for "<strong>{searchTerm}</strong>"
        </div>
      )}

      {/* 🗺 Map */}
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={70}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* ✅ Fit to filtered markers */}
        <FitBoundsHandler locations={filteredBranchLocations} />

        {/* 🔖 Markers */}
        {filteredBranchLocations.map((branch, i) => (
          <Marker key={i} position={[branch.latitude, branch.longitude]}>
            <Popup>
              <h3 className="font-bold text-lg mb-1">
                {highlightText(branch.city, searchTerm)} Branch
              </h3>
              <p className="text-sm text-gray-700">
                District: {highlightText(branch.district, searchTerm)} <br />
                Region: {branch.region} <br />
                Status:{' '}
                <span
                  className={
                    branch.status === 'active'
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }
                >
                  {branch.status.toUpperCase()}
                </span>
              </p>
              {branch.covered_area?.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Covered Areas:</strong>{' '}
                  {branch.covered_area.map((area, idx) => (
                    <span key={idx}>
                      {highlightText(area, searchTerm)}
                      {idx < branch.covered_area.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              )}
              {branch.flowchart && (
                <a
                  href={branch.flowchart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 block"
                >
                  View Flowchart
                </a>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
