import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Circle, Marker, InfoWindow } from '@react-google-maps/api';
import { Home, Navigation } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];

interface PublicMapProps {
    userLocation?: { lat: number; lng: number } | null;
    floodZones: Array<{ lat: number; lng: number; radius: number; severity: 'HIGH' | 'MODERATE' }>;
    shelters: Array<{ id: string; name: string; lat: number; lng: number; capacity: number }>;
}

const PublicMap: React.FC<PublicMapProps> = ({ userLocation, floodZones, shelters }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    });

    const [selectedShelter, setSelectedShelter] = useState<any | null>(null);

    const onLoad = useCallback(function callback() {
        // Map loaded
    }, []);

    const onUnmount = useCallback(function callback() {
        // Map unmounted
    }, []);

    // Center map on user or first flood zone
    const center = userLocation || (floodZones.length > 0 ? { lat: floodZones[0].lat, lng: floodZones[0].lng } : { lat: 18.0, lng: 82.0 });

    return isLoaded ? (
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner bg-slate-100 border border-slate-200">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={userLocation ? 12 : 10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    styles: mapStyles,
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {/* User Location */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#3b82f6',
                            fillOpacity: 1,
                            strokeWeight: 4,
                            strokeColor: '#ffffff',
                        }}
                    />
                )}

                {/* Flood Zones */}
                {floodZones.map((zone, idx) => (
                    <Circle
                        key={`zone-${idx}`}
                        center={{ lat: zone.lat, lng: zone.lng }}
                        radius={zone.radius}
                        options={{
                            strokeColor: zone.severity === 'HIGH' ? '#ef4444' : '#f97316',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: zone.severity === 'HIGH' ? '#ef4444' : '#f97316',
                            fillOpacity: 0.35,
                        }}
                    />
                ))}

                {/* Shelters */}
                {shelters.map((shelter) => (
                    <Marker
                        key={shelter.id}
                        position={{ lat: shelter.lat, lng: shelter.lng }}
                        onClick={() => setSelectedShelter(shelter)}
                        icon={{
                            path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
                            fillColor: "#22c55e",
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: "#ffffff",
                            scale: 1,
                            anchor: new google.maps.Point(12, 12),
                        }}
                    />
                ))}

                {selectedShelter && (
                    <InfoWindow
                        position={{ lat: selectedShelter.lat, lng: selectedShelter.lng }}
                        onCloseClick={() => setSelectedShelter(null)}
                    >
                        <div className="p-2 text-slate-800">
                            <h3 className="font-bold flex items-center gap-1">
                                <Home className="w-4 h-4 text-emerald-500" /> {selectedShelter.name}
                            </h3>
                            <p className="text-xs mt-1">Capacity: {selectedShelter.capacity} people</p>
                            <button className="mt-2 w-full bg-sky-600 text-white text-[10px] font-bold py-1.5 rounded flex items-center justify-center gap-1">
                                <Navigation className="w-3 h-3" /> GET DIRECTIONS
                            </button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    ) : <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl" />;
};

export default PublicMap;
