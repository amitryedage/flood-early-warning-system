import React, { useState } from 'react';
import StatusBanner from '../../components/Public/StatusBanner';
import ThreatGauge from '../../components/Public/ThreatGauge';
import InfoCardsGrid from '../../components/Public/InfoCardsGrid';
import QuickActionsGrid from '../../components/Public/QuickActionsGrid';
import AlertsFeed from '../../components/Public/AlertsFeed';
import SafetyTipsAccordion from '../../components/Public/SafetyTipsAccordion';
import FloodReportForm from '../../components/Public/FloodReportForm';
import PublicMap from '../../components/Map/PublicMap';
import AlertSubscriptionForm from '../../components/Public/AlertSubscriptionForm';
import HeroSection from '../../components/Public/HeroSection';
import WaterLevelForecast from '../../components/Public/WaterLevelForecast';
import EmergencyContacts from '../../components/Public/EmergencyContacts';
import FloodHouseVisual from '../../components/Public/FloodHouseVisual';
import WeatherParticles from '../../components/Effects/WeatherParticles';
import { AlertOctagon, Map as MapIcon, X } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

import { useJsApiLoader } from '@react-google-maps/api';

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places", "visualization"];

const PublicDashboard: React.FC = () => {
    const { floodData, isConnected: connected } = useSocket();
    const [showReportForm, setShowReportForm] = useState(false);
    const [showPublicMap, setShowPublicMap] = useState(false);
    const [showAlertForm, setShowAlertForm] = useState(false);
    const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Weather Particles Effect */}
            {floodData?.status === 'CRITICAL' && <WeatherParticles intensity="heavy" type="storm" />}
            {floodData?.status === 'WARNING' && <WeatherParticles intensity="moderate" type="rain" />}

            {/* Connection Status Indicator */}
            {!connected && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm flex items-center gap-3 shadow-sm border-l-4">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="font-semibold text-amber-900">SYSTEM CONNECTING:</span>
                    System connecting to live telemetry...
                </div>
            )}

            {/* Level 1: Global Safety Status (Hero) */}
            <div className="w-full">
                <HeroSection onSearch={async (term) => {
                    // Open Map
                    setShowPublicMap(true);

                    if (isLoaded && window.google && window.google.maps) {
                        const geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ address: term }, (results, status) => {
                            if (status === 'OK' && results && results[0]) {
                                const location = results[0].geometry.location;
                                setUserLoc({ lat: location.lat(), lng: location.lng() });
                            } else {
                                console.warn('Geocode failed due to: ' + status);
                            }
                        });
                    } else {
                        console.warn('Google Maps API not loaded yet');
                    }
                }} />
                <StatusBanner status={
                    floodData?.status === 'NORMAL' ? 'safe' :
                        floodData?.status.toLowerCase() as any || "safe"
                } />
            </div>

            {/* Level 2 & 3: Quick Actions & Key Metrics */}
            <div className="dashboard-grid">
                {/* Critical Actions Sidebar / Top Panel */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        <button
                            onClick={() => setShowReportForm(true)}
                            className="flex flex-col items-start gap-4 p-6 bg-red-600 hover:bg-red-700 text-white rounded-3xl shadow-lg shadow-red-100 transition-all active:scale-[0.98] group"
                        >
                            <div className="p-3 bg-white/20 rounded-xl">
                                <AlertOctagon className="w-6 h-6 group-hover:animate-bounce" />
                            </div>
                            <div className="text-left">
                                <span className="block font-black text-lg leading-none uppercase tracking-tight">Report Flood</span>
                                <span className="text-xs font-bold text-red-100 opacity-80">Notify authorities immediately</span>
                            </div>
                        </button>

                        <button
                            onClick={() => setShowPublicMap(true)}
                            className="flex flex-col items-start gap-4 p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] group"
                        >
                            <div className="p-3 bg-white/20 rounded-xl">
                                <MapIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="text-left">
                                <span className="block font-black text-lg leading-none uppercase tracking-tight">Evacuation Map</span>
                                <span className="text-xs font-bold text-blue-100 opacity-80">View nearby shelters & routes</span>
                            </div>
                        </button>
                    </div>

                    <QuickActionsGrid onAction={(action) => {
                        if (action === 'ALERTS') setShowAlertForm(true);
                        if (action === 'SHELTERS') setShowPublicMap(true); // Map shows shelters
                        // Handle other actions if needed
                    }} />
                </div>

                {/* Real-time Monitoring Center */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Metrics Overview */}
                    <InfoCardsGrid
                        rainfall={floodData?.rainfall}
                        weather={floodData?.weather ? {
                            temp: floodData.weather.temperature,
                            condition: floodData.weather.condition
                        } : undefined}
                        status={floodData?.status}
                        timestamp={floodData?.timestamp}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="standard-card">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Threat Gauge</h3>
                            <ThreatGauge waterLevel={floodData?.waterLevel} />
                        </div>
                        <div className="standard-card">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Your Property Risk</h3>
                            <FloodHouseVisual waterLevel={floodData?.waterLevel || 10} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Level 4: Forecasts & Historical Data */}
            <div className="dashboard-grid">
                <div className="col-span-12 lg:col-span-8">
                    <div className="standard-card min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 leading-none">Water Level Forecast</h3>
                                <p className="text-sm text-gray-500 mt-1 font-medium">8-hour projected telemetry</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-wider">Predictive AI</span>
                            </div>
                        </div>
                        <WaterLevelForecast
                            forecast={floodData?.forecast}
                            currentLevel={floodData?.waterLevel}
                        />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <AlertsFeed />

                    {/* Community Resources */}
                    <div className="standard-card bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-8 border-none ring-4 ring-blue-50 shadow-blue-100">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black mb-2 italic">Citizen Alert Network</h3>
                            <p className="text-sm text-blue-100/80 leading-relaxed font-medium">Join 50,000+ citizens receiving real-time automated safety notifications.</p>
                        </div>
                        <button
                            onClick={() => setShowAlertForm(true)}
                            className="w-full bg-white text-blue-900 font-bold py-4 rounded-2xl shadow-xl hover:bg-gray-50 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                <SafetyTipsAccordion />
                <EmergencyContacts />
            </div>

            {/* Overlays (Report, Map, Subscription) - Unchanged Logic */}
            {showReportForm && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportForm(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <button
                                onClick={() => setShowReportForm(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                            <FloodReportForm onClose={() => setShowReportForm(false)} />
                        </div>
                    </div>
                </div>
            )}

            {showPublicMap && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPublicMap(false)}></div>
                    <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h3 className="font-black text-slate-800 flex items-center gap-2 text-lg italic">
                                    <MapIcon className="text-sky-600" /> LIVE EVACUATION MAP
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authorized Shelter Locations & Risk Zones</p>
                            </div>
                            <button
                                onClick={() => setShowPublicMap(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <div className="flex-1 relative">
                            <PublicMap
                                isLoaded={isLoaded}
                                userLocation={userLoc}
                                floodZones={floodData ? [{
                                    lat: 18.0,
                                    lng: 82.0,
                                    radius: 50000 * (floodData.waterLevel / 12),
                                    severity: floodData.status === 'CRITICAL' ? 'HIGH' : 'MODERATE'
                                }] : []}
                                shelters={[
                                    { id: 's1', name: 'Community Center', lat: 18.05, lng: 82.05, capacity: 500 },
                                    { id: 's2', name: 'High School', lat: 17.85, lng: 81.85, capacity: 1000 }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showAlertForm && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAlertForm(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <AlertSubscriptionForm onClose={() => setShowAlertForm(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicDashboard;
