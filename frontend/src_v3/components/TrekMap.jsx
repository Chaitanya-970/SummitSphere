import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon issue in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- AUTO-ZOOM COMPONENT --- (DO NOT MODIFY)
const MapRecenter = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [points, map]);
  return null;
};

const TrekMap = ({ itinerary, center = [30.7333, 76.7794] }) => {
  const safeItinerary = Array.isArray(itinerary) ? itinerary : [];

  // COORDINATE FLIP: [lon, lat] from DB → [lat, lon] for Leaflet — DO NOT MODIFY
  const markerDays = safeItinerary
    .filter((day) => Array.isArray(day.coordinates) && day.coordinates.length === 2)
    .map((day) => {
      const [lon, lat] = day.coordinates; // Extract from GeoJSON format
      return {
        ...day,
        leafletCoords: [lat, lon] // Create Leaflet-ready [Lat, Lon]
      };
    });

  const pathCoordinates = markerDays.map((day) => day.leafletCoords);

  return (
    <div style={{
      width: '100%',
      height: 'clamp(320px, 45vh, 480px)',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      zIndex: 0,
    }}>
      <MapContainer
        center={pathCoordinates.length > 0 ? pathCoordinates[0] : center}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter points={pathCoordinates} />

        {markerDays.map((day, idx) => (
          <Marker key={idx} position={day.leafletCoords}>
            <Popup>
              <div style={{ fontFamily: 'Syne, sans-serif', padding: '4px' }}>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#2d6a4f', fontWeight: 700, marginBottom: '4px' }}>Day {day.day}</p>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1208' }}>{day.title}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {pathCoordinates.length > 1 && (
          <Polyline
            positions={pathCoordinates}
            pathOptions={{
              color: '#2d6a4f',
              weight: 4,
              dashArray: '8, 12',
              lineCap: 'round'
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TrekMap;
