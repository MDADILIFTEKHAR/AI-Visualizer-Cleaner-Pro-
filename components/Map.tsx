import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DataSet } from '../types';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewerProps {
  dataset: DataSet;
}

export const MapViewer: React.FC<MapViewerProps> = ({ dataset }) => {
  // Try to find lat/lon columns
  const latCol = dataset.profile.find(c => ['lat', 'latitude'].includes(c.name.toLowerCase()))?.name;
  const lonCol = dataset.profile.find(c => ['lon', 'lng', 'longitude'].includes(c.name.toLowerCase()))?.name;

  if (!latCol || !lonCol) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
        <p className="text-lg font-medium">No Geolocation Data Detected</p>
        <p className="text-sm mt-2">Ensure your dataset has columns named "Lat", "Latitude", "Lon", or "Longitude".</p>
      </div>
    );
  }

  const markers = dataset.rows
    .slice(0, 500) // Limit markers for performance
    .filter(r => r[latCol] && r[lonCol])
    .map((r, idx) => ({
      lat: Number(r[latCol]),
      lng: Number(r[lonCol]),
      title: Object.values(r)[0] as string // Use first column as title
    }));

  const center: [number, number] = markers.length > 0 ? [markers[0].lat, markers[0].lng] : [51.505, -0.09];

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative z-0">
      <MapContainer center={center} zoom={4} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {markers.map((m, idx) => (
          <Marker key={idx} position={[m.lat, m.lng]}>
            <Popup>{m.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
