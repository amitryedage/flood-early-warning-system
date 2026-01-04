import React, { useState } from 'react';
import StatusBanner from '../../components/Public/StatusBanner';
import ThreatGauge from '../../components/Public/ThreatGauge';
import InfoCardsGrid from '../../components/Public/InfoCardsGrid';
import QuickActionsGrid from '../../components/Public/QuickActionsGrid';
import AlertsFeed from '../../components/Public/AlertsFeed';
import SafetyTipsAccordion from '../../components/Public/SafetyTipsAccordion';
import RiskAssessor from '../../components/Public/RiskAssessor';
import FloodReportForm from '../../components/Public/FloodReportForm';
import PublicMap from '../../components/Map/PublicMap';
import AlertSubscriptionForm from '../../components/Public/AlertSubscriptionForm';
import WaterLevelForecast from '../../components/Public/WaterLevelForecast';
import EmergencyContacts from '../../components/Public/EmergencyContacts';
import { AlertOctagon, Map as MapIcon, X } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

const PublicDashboard: React.FC = () => {
    const { floodData, isConnected: connected } = useSocket();
    const [showReportForm, setShowReportForm] = useState(false);
    const [showPublicMap, setShowPublicMap] = useState(false);
    const [showAlertForm, setShowAlertForm] = useState(false);
    const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Connection Status Indicator */}
            {!connected && (
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800 text-sm flex items-center gap-3 shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    ⚠️ System connecting to live telemetry...
                </div>
            )}

            {/* Top Section: Hero Alerts & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Main Status & Risk (Left/Center biased) */}
                <div className="lg:col-span-8 space-y-6">
                    <StatusBanner status={
                        floodData?.status === 'NORMAL' ? 'safe' :
                            floodData?.status.toLowerCase() as any || "safe"
                    } />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RiskAssessor
                            onLocationUpdate={setUserLoc}
                            floodZones={floodData ? [{
                                lat: 18.0,
                                lng: 82.0,
                                radius: 50000 * (floodData.waterLevel / 12),
                                severity: floodData.status === 'CRITICAL' ? 'HIGH' : 'MODERATE'
                            }] : []}
                        />
                        <ThreatGauge waterLevel={floodData?.waterLevel} />
                    </div>
                </div>

                {/* Quick Actions (Right biased) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setShowReportForm(true)}
                            className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black py-6 rounded-3xl shadow-xl shadow-red-100 transition-all active:scale-95 group"
                        >
                            <AlertOctagon className="w-6 h-6 group-hover:animate-bounce" />
                            <span className="tracking-tight">REPORT LOCAL FLOODING</span>
                        </button>
                        <button
                            onClick={() => setShowPublicMap(true)}
                            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-black py-6 rounded-3xl shadow-xl shadow-slate-200 transition-all active:scale-95 group"
                        >
                            <MapIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span className="tracking-tight">OPEN EVACUATION MAP</span>
                        </button>
                    </div>
                    <QuickActionsGrid onAction={(action) => {
                        if (action === 'MAP') setShowPublicMap(true);
                        if (action === 'ALERTS') setShowAlertForm(true);
                    }} />
                </div>
            </div>

            {/* Metrics Bar */}
            <div className="mb-8">
                <InfoCardsGrid
                    rainfall={floodData?.rainfall}
                    weather={floodData?.weather}
                    status={floodData?.status}
                    timestamp={floodData?.timestamp}
                />
            </div>

            {/* Dynamic Grid: Feeds, Forecasts & Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Column 1: Alerts & Safety */}
                <div className="space-y-8">
                    <AlertsFeed />
                    <SafetyTipsAccordion />
                </div>

                {/* Column 2: Visualizations */}
                <div className="space-y-8">
                    <WaterLevelForecast
                        forecast={floodData?.forecast}
                        currentLevel={floodData?.waterLevel}
                    />
                </div>

                {/* Column 3: Resources & Community */}
                <div className="space-y-8">
                    <EmergencyContacts />
                    <div className="bg-gradient-to-br from-sky-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-xl font-black mb-2 italic">Stay Informed</h3>
                        <p className="text-sm text-sky-100 mb-6 leading-relaxed">Join 50,000+ citizens receiving real-time SMS and Email alerts for their specific area.</p>
                        <button
                            onClick={() => setShowAlertForm(true)}
                            className="w-full bg-white text-sky-900 font-bold py-3 rounded-2xl shadow-lg hover:bg-sky-50 transition-colors uppercase tracking-widest text-xs"
                        >
                            Subscribe to Alerts
                        </button>
                    </div>
                </div>
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
