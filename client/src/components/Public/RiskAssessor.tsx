import React, { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { calculateDistance } from '../../utils/geoUtils';

interface RiskAssessorProps {
    floodZones: Array<{ lat: number; lng: number; radius: number; severity: 'HIGH' | 'MODERATE' }>;
    onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

const RiskAssessor: React.FC<RiskAssessorProps> = ({ floodZones, onLocationUpdate }) => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [status, setStatus] = useState<'SAFE' | 'WARNING' | 'CRITICAL' | 'UNKNOWN'>('UNKNOWN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkSafety = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newLoc = { lat: latitude, lng: longitude };
                setUserLocation(newLoc);
                if (onLocationUpdate) onLocationUpdate(newLoc);
                setLoading(false);
                setError(null);
            },
            () => {
                setError("Unable to retrieve your location");
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        if (userLocation && floodZones.length > 0) {
            let highestRisk: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';

            for (const zone of floodZones) {
                const distance = calculateDistance(userLocation.lat, userLocation.lng, zone.lat, zone.lng);

                // If user is inside the radius
                if (distance <= zone.radius) {
                    if (zone.severity === 'HIGH') {
                        highestRisk = 'CRITICAL';
                        break; // Critical is highest, stop looking
                    } else {
                        highestRisk = 'WARNING';
                    }
                }
                // Buffer zone: if user is within 5km of the edge
                else if (distance <= zone.radius + 5000) {
                    if (highestRisk === 'SAFE') {
                        highestRisk = 'WARNING';
                    }
                }
            }
            setStatus(highestRisk);
        } else if (userLocation) {
            setStatus('SAFE');
        }
    }, [userLocation, floodZones]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Am I Safe?</h2>
                        <p className="text-sm text-slate-500">Real-time risk assessment for your location</p>
                    </div>
                    <MapPin className="text-sky-500 w-6 h-6" />
                </div>

                {!userLocation ? (
                    <div className="flex flex-col items-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <button
                            onClick={checkSafety}
                            disabled={loading}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-sky-200 transition-all flex items-center gap-2 active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                            CHECK MY LOCATION
                        </button>
                        {error && <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>}
                        <p className="mt-3 text-slate-400 text-xs">Distance is calculated relative to active alert zones.</p>
                    </div>
                ) : (
                    <div className={`p-6 rounded-xl border flex items-center gap-6 transition-all ${status === 'SAFE' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                        status === 'WARNING' ? 'bg-orange-50 border-orange-100 text-orange-900' :
                            'bg-red-50 border-red-100 text-red-900'
                        }`}>
                        <div className={`p-4 rounded-full ${status === 'SAFE' ? 'bg-emerald-500' :
                            status === 'WARNING' ? 'bg-orange-500' :
                                'bg-red-500'
                            } text-white`}>
                            {status === 'SAFE' && <ShieldCheck className="w-10 h-10" />}
                            {status === 'WARNING' && <AlertTriangle className="w-10 h-10" />}
                            {status === 'CRITICAL' && <AlertCircle className="w-10 h-10" />}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded ${status === 'SAFE' ? 'bg-emerald-200' :
                                    status === 'WARNING' ? 'bg-orange-200' :
                                        'bg-red-200'
                                    }`}>
                                    Status: {status}
                                </span>
                                <button
                                    onClick={checkSafety}
                                    className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 ml-auto"
                                >
                                    <Loader2 className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
                                </button>
                            </div>
                            <h3 className="text-2xl font-black italic">
                                {status === 'SAFE' && "YOU ARE CURRENTLY SAFE"}
                                {status === 'WARNING' && "WARNING: ELEVATED RISK"}
                                {status === 'CRITICAL' && "URGENT: LEAVE THE AREA"}
                            </h3>
                            <p className="text-sm opacity-80 mt-1 font-medium">
                                {status === 'SAFE' && "No active flood zones detected within 5km of your location."}
                                {status === 'WARNING' && "You are near or inside a moderate risk zone. Stay alert and monitor news."}
                                {status === 'CRITICAL' && "You are inside a critical flood zone. Please follow evacuation protocols immediately."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskAssessor;
