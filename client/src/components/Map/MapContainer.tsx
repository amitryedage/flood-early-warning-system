import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Circle, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%'
};

// defaultCenter removed as it was unused and handled in props default

// Dark Mode Map Styles (Snazzy Maps / Google Maps Styling Wizard)
const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

interface MapContainerProps {
    center?: [number, number]; // Keep as array for compatibility, but convert internally
    zoom?: number;
    floodZones?: Array<{ lat: number; lng: number; radius: number; severity: 'HIGH' | 'MODERATE' }>;
    villages?: Array<{ id: string; name: string; lat: number; lng: number; status: 'SAFE' | 'WARNING' | 'CRITICAL' }>;
    shelters?: Array<{ id: string; name: string; lat: number; lng: number; capacity: number }>;
    responseTeams?: Array<{ id: string; name: string; lat: number; lng: number; status: 'AVAILABLE' | 'BUSY' }>;
}

const MapContainer: React.FC<MapContainerProps> = ({
    center = [20.5937, 78.9629],
    zoom = 5,
    floodZones = [],
    villages = [],
    shelters = [],
    responseTeams = []
}) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const [selectedMarker, setSelectedMarker] = useState<any | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    // Fit bounds to include all markers
    React.useEffect(() => {
        if (map) {
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

            if (hasPoints) {
                map.fitBounds(bounds);
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
        <div className="w-full h-full bg-slate-900">
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

                {/* Villages */}
                {villages.map((village) => (
                    <Marker
                        key={village.id}
                        position={{ lat: village.lat, lng: village.lng }}
                        onClick={() => setSelectedMarker(village)}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 7,
                            fillColor: village.status === 'SAFE' ? '#22c55e' : (village.status === 'WARNING' ? '#f97316' : '#ef4444'),
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: '#ffffff',
                        }}
                    />
                ))}

                {/* Shelters */}
                {shelters.map((shelter) => (
                    <Marker
                        key={shelter.id}
                        position={{ lat: shelter.lat, lng: shelter.lng }}
                        onClick={() => setSelectedMarker(shelter)}
                        icon={{
                            path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
                            fillColor: "#3b82f6",
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: "#ffffff",
                            scale: 1,
                            anchor: new google.maps.Point(12, 12),
                        }}
                    />
                ))}

                {/* Response Teams */}
                {responseTeams.map((team) => (
                    <Marker
                        key={team.id}
                        position={{ lat: team.lat, lng: team.lng }}
                        onClick={() => setSelectedMarker(team)}
                        icon={{
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 5,
                            fillColor: team.status === 'AVAILABLE' ? '#eab308' : '#6b7280',
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: '#ffffff',
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
