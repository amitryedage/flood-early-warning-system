import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Circle, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%'
};

// Libraries must be a static constant to prevent re-renders
const LIBRARIES: ("visualization" | "places" | "drawing" | "geometry")[] = ['visualization', 'places'];

// Dark Mode Map Styles (Snazzy Maps / Google Maps Styling Wizard)
// Light/Standard Map Styles
const mapStyles: google.maps.MapTypeStyle[] = [];

interface MapContainerProps {
    center?: [number, number]; // Keep as array for compatibility, but convert internally
    zoom?: number;
    floodZones?: Array<{ lat: number; lng: number; radius: number; severity: 'HIGH' | 'MODERATE' }>;
    villages?: Array<{ id: string; name: string; lat: number; lng: number; status: 'SAFE' | 'WARNING' | 'CRITICAL' }>;
    shelters?: Array<{ id: string; name: string; lat: number; lng: number; capacity: number }>;
    responseTeams?: Array<{ id: string; name: string; lat: number; lng: number; status: 'ON_DUTY' | 'EN_ROUTE' | 'ON_SITE' | string }>;
    tasks?: Array<{ id: string; title: string; lat?: number; lng?: number; status: string; urgency: string }>;
    showHeatmap?: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({
    center = [16.8524, 74.5815],
    zoom = 5,
    floodZones = [],
    villages = [],
    shelters = [],
    responseTeams = [],
    tasks = [],
    showHeatmap = false
}) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries: LIBRARIES
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const [selectedMarker, setSelectedMarker] = useState<any | null>(null);

    const heatmapData = React.useMemo(() => {
        if (!showHeatmap || !window.google) return [];
        const points: google.maps.LatLng[] = [];
        // Generate a cluster of points around Sangli
        const baseLat = 16.8524;
        const baseLng = 74.5815;
        for (let i = 0; i < 50; i++) {
            points.push(new window.google.maps.LatLng(
                baseLat + (Math.random() - 0.5) * 0.1, // Tighter spread for city level
                baseLng + (Math.random() - 0.5) * 0.1
            ));
        }
        return points;
    }, [showHeatmap, isLoaded]);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    const isInitialFit = React.useRef(false);

    // Fit bounds only on initial data load
    React.useEffect(() => {
        if (map && !isInitialFit.current) {
            const bounds = new google.maps.LatLngBounds();
            let hasPoints = false;

            floodZones.forEach(zone => {
                bounds.extend({ lat: zone.lat, lng: zone.lng });
                hasPoints = true;
            });
            villages.forEach(village => {
                bounds.extend({ lat: village.lat, lng: village.lng });
                hasPoints = true;
            });
            shelters.forEach(shelter => {
                bounds.extend({ lat: shelter.lat, lng: shelter.lng });
                hasPoints = true;
            });
            responseTeams.forEach(team => {
                bounds.extend({ lat: team.lat, lng: team.lng });
                hasPoints = true;
            });
            tasks.forEach(task => {
                if (task.lat && task.lng) {
                    bounds.extend({ lat: task.lat, lng: task.lng });
                    hasPoints = true;
                }
            });

            if (hasPoints) {
                map.fitBounds(bounds);
                isInitialFit.current = true;
            }
        }
    }, [map, floodZones, villages, shelters, responseTeams]);

    const mapCenter = {
        lat: center[0],
        lng: center[1]
    };

    if (!isLoaded) {
        return <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">Loading Map...</div>;
    }

    return (
        <div className="w-full h-full bg-gray-100">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    styles: mapStyles,
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
            >
                {/* Heatmap Layer */}
                {showHeatmap && isLoaded && window.google && (
                    <HeatmapLayer
                        data={heatmapData}
                        options={{
                            radius: 30,
                            opacity: 0.6,
                        }}
                    />
                )}
                {/* Flood Zones */}
                {floodZones.map((zone, idx) => (
                    <React.Fragment key={`zone-${idx}`}>
                        <Circle
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
                        {zone.severity === 'HIGH' && (
                            <Circle
                                center={{ lat: zone.lat, lng: zone.lng }}
                                radius={zone.radius * 0.7}
                                options={{
                                    strokeColor: '#ef4444',
                                    strokeOpacity: 0,
                                    fillColor: '#ef4444',
                                    fillOpacity: 0.6,
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}

                {/* Villages -> Houses */}
                {villages.map((village) => (
                    <Marker
                        key={village.id}
                        position={{ lat: village.lat, lng: village.lng }}
                        onClick={() => setSelectedMarker(village)}
                        icon={{
                            path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", // Home Icon
                            scale: 1.2,
                            fillColor: village.status === 'SAFE' ? '#10b981' : (village.status === 'WARNING' ? '#f97316' : '#ef4444'),
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: '#ffffff',
                            anchor: new google.maps.Point(12, 12),
                        }}
                    />
                ))}

                {/* Shelters -> Shields */}
                {shelters.map((shelter) => (
                    <Marker
                        key={shelter.id}
                        position={{ lat: shelter.lat, lng: shelter.lng }}
                        onClick={() => setSelectedMarker(shelter)}
                        icon={{
                            path: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z", // Shield Icon
                            fillColor: "#10b981", // Emerald to match control
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: "#ffffff",
                            scale: 1.2,
                            anchor: new google.maps.Point(12, 12),
                        }}
                    />
                ))}

                {/* Response Teams -> Users/Units */}
                {responseTeams.map((team) => (
                    <Marker
                        key={team.id}
                        position={{ lat: team.lat, lng: team.lng }}
                        onClick={() => setSelectedMarker(team)}
                        icon={{
                            path: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", // Person Icon
                            scale: 1.2,
                            fillColor: team.status === 'ON_DUTY' ? '#3b82f6' : (team.status === 'EN_ROUTE' ? '#eab308' : '#10b981'),
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: '#ffffff',
                            anchor: new google.maps.Point(12, 12),
                        }}
                    />
                ))}

                {/* Emergency Tasks -> Alerts */}
                {tasks.filter(t => t.status !== 'COMPLETED' && t.lat !== undefined && t.lng !== undefined).map((task) => (
                    <Marker
                        key={task.id}
                        position={{ lat: task.lat!, lng: task.lng! }}
                        onClick={() => setSelectedMarker({ ...task, name: task.title, details: `Urgency: ${task.urgency}` })}
                        icon={{
                            path: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z", // Warning Triangle
                            fillColor: task.urgency === 'HIGH' ? '#ef4444' : '#f97316',
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: '#ffffff',
                            scale: 1.2,
                            anchor: new google.maps.Point(12, 12),
                        }}
                    />
                ))}

                {/* InfoWindow */}
                {selectedMarker && (
                    <InfoWindow
                        position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="text-black p-2">
                            <h3 className="font-bold">{selectedMarker.name || 'Unknown Location'}</h3>
                            {selectedMarker.details && <p>{selectedMarker.details}</p>}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default MapContainer;
