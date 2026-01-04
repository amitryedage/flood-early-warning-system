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

                if (distance <= zone.radius) {
                    if (zone.severity === 'HIGH') {
                        highestRisk = 'CRITICAL';
                        break;
                    } else {
                        highestRisk = 'WARNING';
                    }
                }
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Am I Safe?</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time risk assessment for your location</p>
                    </div>
                    <MapPin className="text-sky-500 w-5 h-5" />
                </div>

                {!userLocation ? (
                    <div className="flex flex-col items-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <button
                            onClick={checkSafety}
                            disabled={loading}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-sky-100 transition-all flex items-center gap-2 active:scale-95 text-sm uppercase tracking-wider"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                            CHECK MY LOCATION
                        </button>
                        {error && <p className="mt-4 text-red-500 text-[10px] font-bold uppercase">{error}</p>}
                        <p className="mt-4 text-slate-400 text-[10px] uppercase tracking-tighter">Calculated relative to active alert zones.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center justify-center h-48 py-4 relative group">
                        <div className={`p-5 rounded-full mb-4 shadow-xl transition-all duration-700 ${status === 'SAFE' ? 'bg-emerald-500 shadow-emerald-100' :
                            status === 'WARNING' ? 'bg-orange-500 shadow-orange-100' :
                                'bg-red-500 shadow-red-100'
                            } text-white`}>
                            {status === 'SAFE' && <ShieldCheck className="w-12 h-12" />}
                            {status === 'WARNING' && <AlertTriangle className="w-12 h-12" />}
                            {status === 'CRITICAL' && <AlertCircle className="w-12 h-12" />}
                        </div>
                        <button
                            onClick={checkSafety}
                            className="text-slate-400 hover:text-slate-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                            <Loader2 className={`w-2.5 h-2.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                    </div>
                )}
            </div>

            {userLocation && (
                <div className={`p-5 flex flex-col gap-1 transition-all duration-700 border-t ${status === 'SAFE' ? 'bg-emerald-50/80 border-emerald-100' :
                    status === 'WARNING' ? 'bg-orange-50/80 border-orange-100' :
                        'bg-red-50/80 border-red-100'
                    }`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded ${status === 'SAFE' ? 'bg-emerald-200 text-emerald-800' :
                            status === 'WARNING' ? 'bg-orange-200 text-orange-800' :
                                'bg-red-200 text-red-800'
                            }`}>
                            STATUS: {status}
                        </span>
                    </div>
                    <h3 className={`text-xl font-black italic tracking-tight ${status === 'SAFE' ? 'text-emerald-900' :
                        status === 'WARNING' ? 'text-orange-900' :
                            'text-red-900'
                        }`}>
                        {status === 'SAFE' && "YOU ARE CURRENTLY SAFE"}
                        {status === 'WARNING' && "WARNING: ELEVATED RISK"}
                        {status === 'CRITICAL' && "URGENT: LEAVE THE AREA"}
                    </h3>
                    <p className={`text-[11px] font-medium opacity-70 leading-tight ${status === 'SAFE' ? 'text-emerald-800' :
                        status === 'WARNING' ? 'text-orange-800' :
                            'text-red-800'
                        }`}>
                        {status === 'SAFE' && "No active flood zones detected within your vicinity."}
                        {status === 'WARNING' && "Elevated water levels in adjacent zones. Stay alert."}
                        {status === 'CRITICAL' && "Critical hazard detected. Evacuate immediately."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RiskAssessor;
