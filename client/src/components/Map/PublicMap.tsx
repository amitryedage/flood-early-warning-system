import React, { useCallback, useState } from 'react';
import { GoogleMap, Circle, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { Navigation, ShieldCheck } from 'lucide-react';

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
    isLoaded?: boolean;
    isSafeRouteActive?: boolean;
}

const PublicMap: React.FC<PublicMapProps> = ({
    userLocation,
    floodZones,
    shelters,
    isLoaded = true,
    isSafeRouteActive
}) => {
    // Internal loader removed to rely on parent loader or global script (simplified for this context)
    // If used standalone, it needs a loader, but here it's embedded.

    // Fallback if not passed (though ideally parent handles it)
    // const { isLoaded: internalLoaded } = useJsApiLoader(...) 
    // For now we assume parent passes it or we render if loaded.

    // To handle both cases safely without re-loading script with diff libraries:
    // If the parent is loading it, we just wait.

    const [selectedShelter, setSelectedShelter] = useState<any | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    // Effect to pan map when location changes
    React.useEffect(() => {
        if (map && userLocation) {
            map.panTo(userLocation);
            map.setZoom(13);
        }
    }, [map, userLocation]);

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

                {/* Safe Corridor AI Visualization */}
                {isSafeRouteActive && userLocation && shelters.length > 0 && (
                    <Polyline
                        path={[
                            userLocation,
                            // Simulate AI path nodes that avoid flood zones
                            { lat: (userLocation.lat + shelters[0].lat) / 2 + 0.002, lng: (userLocation.lng + shelters[0].lng) / 2 - 0.002 },
                            { lat: (userLocation.lat + shelters[0].lat) / 2, lng: (userLocation.lng + shelters[0].lng) / 2 },
                            { lat: shelters[0].lat, lng: shelters[0].lng }
                        ]}
                        options={{
                            strokeColor: "#3b82f6",
                            strokeOpacity: 0.8,
                            strokeWeight: 5,
                            icons: [{
                                icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, fillOpacity: 1 },
                                offset: '100%',
                                repeat: '50px'
                            }],
                            zIndex: 500
                        }}
                    />
                )}

                {selectedShelter && (
                    <InfoWindow
                        position={{ lat: selectedShelter.lat, lng: selectedShelter.lng }}
                        onCloseClick={() => setSelectedShelter(null)}
                    >
                        <div className="p-2 text-slate-800 w-48">
                            <h3 className="font-bold flex items-center gap-1 text-sm bg-blue-50 -m-2 mb-2 p-2">
                                <ShieldCheck className="w-4 h-4 text-blue-500" /> {selectedShelter.name}
                            </h3>
                            <div className="space-y-2 mt-2">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-slate-500 uppercase">Capacity</span>
                                    <span className="font-black text-emerald-600">85% FILLED</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                                </div>
                                <div className="flex gap-1">
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[8px] font-bold">FOOD</span>
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[8px] font-bold">BEDS</span>
                                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[8px] font-bold">OPEN</span>
                                </div>
                            </div>
                            <button className="mt-3 w-full bg-slate-900 text-white text-[10px] font-black py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                                <Navigation className="w-3 h-3" /> START NAVIGATION
                            </button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    ) : <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl" />;
};

export default PublicMap;
