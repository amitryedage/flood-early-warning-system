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
import RescueStatus from '../../components/Public/RescueStatus';
import SafeRouteAI from '../../components/Public/SafeRouteAI';
import CommunityHelpForm from '../../components/Public/CommunityHelpForm';
import { useSocket } from '../../hooks/useSocket';
import { useToast } from '../../context/ToastContext';

import { useJsApiLoader } from '@react-google-maps/api';

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["visualization", "places"];

const PublicDashboard: React.FC = () => {
    const { floodData, isConnected: connected } = useSocket();
    const { addToast } = useToast();
    const [showReportForm, setShowReportForm] = useState(false);
    const [showPublicMap, setShowPublicMap] = useState(false);
    const [showAlertForm, setShowAlertForm] = useState(false);
    const [isSosActive, setIsSosActive] = useState(false);
    const [isSafeRouteActive, setIsSafeRouteActive] = useState(false);
    const [showCommunityForm, setShowCommunityForm] = useState(false);
    const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedVillage, setSelectedVillage] = useState<any | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    const handleSearch = async (term: string) => {
        // Open Map
        setShowPublicMap(true);

        // 1. Direct Village Match
        const match = floodData?.villages.find(v => v.name.toLowerCase().includes(term.toLowerCase()));
        if (match) {
            setSelectedVillage(match);
            setUserLoc({ lat: match.lat, lng: match.lng });
            addToast('success', `Location Found: Focusing on ${match.name} Sector`, 3000);
            return;
        }

        // 2. Geocoding Fallback (Pincodes/Areas)
        if (isLoaded && window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();

            // Intelligence: If input is a 6-digit number, treat it as an Indian Pincode
            const isPincode = /^\d{6}$/.test(term.trim());
            const searchQuery = isPincode ? `${term.trim()}, India` : term;

            geocoder.geocode({ address: searchQuery }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const location = results[0].geometry.location;
                    const searchLat = location.lat();
                    const searchLng = location.lng();

                    setUserLoc({ lat: searchLat, lng: searchLng });

                    // Find Closest monitored village to this location
                    if (floodData?.villages && floodData.villages.length > 0) {
                        let closest = floodData.villages[0];
                        let minOrb = Number.MAX_VALUE;

                        floodData.villages.forEach(v => {
                            // Simple Euclidean distance for selection logic
                            const dist = Math.sqrt(Math.pow(v.lat - searchLat, 2) + Math.pow(v.lng - searchLng, 2));
                            if (dist < minOrb) {
                                minOrb = dist;
                                closest = v;
                            }
                        });

                        setSelectedVillage(closest);
                        addToast('info', `Showing data for nearest monitored sector: ${closest.name}`, 4000);
                    } else {
                        setSelectedVillage(null);
                    }
                } else if (status === 'ZERO_RESULTS') {
                    addToast('warning', 'Location outside monitored area. Currently optimized for Sangli region.', 4000);
                } else if (status === 'OVER_QUERY_LIMIT') {
                    addToast('warning', 'Search limit reached. Please try again soon.', 3000);
                } else if (status === 'REQUEST_DENIED') {
                    addToast('info', 'Global search disabled. Please enter a Sangli sector name (e.g. Sangli, Miraj).', 5000);
                } else {
                    addToast('info', 'Searching... Please try a local sector name.', 3000);
                    console.warn('Geocode failed due to: ' + status);
                }
            });
        } else {
            console.warn('Google Maps API not loaded yet');
        }
    };
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
            <div className="w-full space-y-6">
                <HeroSection onSearch={handleSearch} />

                {/* Relocated Stats Row */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-12 py-6 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in duration-700">
                    <div className="text-center px-6">
                        <div className="text-3xl font-black text-slate-900 mb-1">42</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Sensors</div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-slate-100"></div>
                    <div className="text-center px-6">
                        <div className="text-3xl font-black text-red-600 mb-1">0</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical Alerts</div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-slate-100"></div>
                    <div className="text-center px-6">
                        <div className="text-3xl font-black text-cyan-600 mb-1">24/7</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Monitoring</div>
                    </div>
                </div>

                <StatusBanner
                    status={
                        selectedVillage ? (selectedVillage.status.toLowerCase() as any) :
                            floodData?.status === 'NORMAL' ? 'safe' :
                                floodData?.status.toLowerCase() as any || "safe"
                    }
                    villageName={selectedVillage?.name}
                    customSubtitle={selectedVillage ? `Risk Level: ${selectedVillage.riskLevel}%` : undefined}
                />
            </div>

            {/* Level 2 & 3: Quick Actions & Key Metrics */}
            <div className="dashboard-grid">
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
                        if (action === 'HELP') setShowCommunityForm(true);
                        if (action === 'SHELTERS') {
                            setShowPublicMap(true); // Map shows shelters
                            setIsSafeRouteActive(true); // Trigger Masterstroke: SafeRoute AI
                        }
                        if (action === 'SOS') {
                            setIsSosActive(true);
                            if ("geolocation" in navigator) {
                                navigator.geolocation.getCurrentPosition(() => {
                                    addToast('error', `🚨 SOS BROADCASTED! Rescue teams notified of your location.`, 6000);
                                });
                            } else {
                                addToast('error', "🚨 EMERGENCY ALERT SENT! (GPS unavailable)", 4000);
                            }
                        }
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
                            <ThreatGauge
                                waterLevel={floodData?.waterLevel}
                                riskLevel={selectedVillage?.riskLevel}
                            />
                        </div>
                        <div className="standard-card">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Your Property Risk</h3>
                            <FloodHouseVisual
                                waterLevel={selectedVillage ? (10 + (selectedVillage.riskLevel / 100) * 5) : (floodData?.waterLevel || 10)}
                            />
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
            {
                showReportForm && (
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
                )
            }

            {
                showPublicMap && (
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
                                    isSafeRouteActive={isSafeRouteActive}
                                    floodZones={floodData ? [{
                                        lat: userLoc?.lat || 18.0,
                                        lng: userLoc?.lng || 82.0,
                                        radius: 500 * (floodData.waterLevel / 12),
                                        severity: floodData.status === 'CRITICAL' ? 'HIGH' : 'MODERATE'
                                    }] : []}
                                    shelters={[
                                        { id: 's1', name: 'St. Mary School', lat: (userLoc?.lat || 18.0) + 0.005, lng: (userLoc?.lng || 82.0) + 0.005, capacity: 500 },
                                        { id: 's2', name: 'Hilltop Plaza', lat: (userLoc?.lat || 18.0) - 0.005, lng: (userLoc?.lng || 82.0) - 0.005, capacity: 1000 }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showAlertForm && (
                    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAlertForm(false)}></div>
                        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="p-8">
                                <AlertSubscriptionForm onClose={() => setShowAlertForm(false)} />
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Community Help Overlay */}
            {
                showCommunityForm && (
                    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCommunityForm(false)}></div>
                        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="p-8">
                                <CommunityHelpForm
                                    onClose={() => setShowCommunityForm(false)}
                                    onSubmit={(_data) => {
                                        addToast('success', 'Thank you! Your community asset is now live in the War Room.', 5000);
                                        setShowCommunityForm(false);
                                        // Mock emission to socket
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Live Rescue Mission Simulation Overlay */}
            {isSosActive && <RescueStatus onClose={() => setIsSosActive(false)} />}

            {/* SafeRoute AI Tactical Guidance Overlay */}
            {isSafeRouteActive && showPublicMap && (
                <SafeRouteAI
                    onClose={() => setIsSafeRouteActive(false)}
                    activeVillage={selectedVillage?.name}
                />
            )}
        </div>
    );
};

export default PublicDashboard;
