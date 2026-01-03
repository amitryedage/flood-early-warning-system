import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet markers in React
// In a real app we'd import images, but for now we'll rely on CSS or CDN if needed, 
// or just standard markers.
// However, Leaflet default icons often break in bundlers without config.
// I'll use a custom DivIcon or simple circle markers for the demo look.

interface MapContainerProps {
    center?: [number, number];
    zoom?: number;
    floodZones?: Array<{ lat: number; lng: number; radius: number; severity: 'HIGH' | 'MODERATE' }>;
}

const MapContainer: React.FC<MapContainerProps> = ({
    center = [20.5937, 78.9629], // India Center
    zoom = 5,
    floodZones = []
}) => {
    return (
        <div className="w-full h-full bg-slate-900">
            <LeafletMap
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                className="z-0"
            >
                {/* Dark Matter Tiles for that "Satellite/War Room" look (Free, no API key) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Flood Zones (Simulated Heatmap) */}
                {floodZones.map((zone, idx) => (
                    <Circle
                        key={idx}
                        center={[zone.lat, zone.lng]}
                        radius={zone.radius}
                        pathOptions={{
                            color: zone.severity === 'HIGH' ? '#ef4444' : '#f97316',
                            fillColor: zone.severity === 'HIGH' ? '#ef4444' : '#f97316',
                            fillOpacity: 0.4,
                            weight: 0
                        }}
                    />
                ))}

                {/* Pulse Animations for Critical Zones (CSS animation would be applied to class) */}
                {floodZones.filter(z => z.severity === 'HIGH').map((zone, idx) => (
                    <Circle
                        key={`pulse-${idx}`}
                        center={[zone.lat, zone.lng]}
                        radius={zone.radius * 1.2}
                        pathOptions={{
                            color: '#ef4444',
                            fillColor: 'transparent',
                            weight: 1,
                            dashArray: '5, 10'
                        }}
                    />
                ))}
            </LeafletMap>
        </div>
    );
};

export default MapContainer;
