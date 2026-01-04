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
import { AlertOctagon, Map as MapIcon, X } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

const PublicDashboard: React.FC = () => {
    const { floodData, isConnected: connected } = useSocket();
    const [showReportForm, setShowReportForm] = useState(false);
    const [showPublicMap, setShowPublicMap] = useState(false);
    const [showAlertForm, setShowAlertForm] = useState(false);
    const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Connection Status Indicator */}
            {!connected && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                    ⚠️ Connecting to server...
                </div>
            )}

            {/* 1. Status Banner */}
            <StatusBanner status={floodData?.status.toLowerCase() as any || "safe"} />

            {/* 2. Risk Assessor - NEW */}
            <RiskAssessor
                onLocationUpdate={setUserLoc}
                floodZones={floodData ? [{
                    lat: 18.0,
                    lng: 82.0,
                    radius: 50000 * (floodData.waterLevel / 12),
                    severity: floodData.status === 'CRITICAL' ? 'HIGH' : 'MODERATE'
                }] : []}
            />

            {/* 3. Main Risk Visualization */}
            <ThreatGauge waterLevel={floodData?.waterLevel} />

            {/* 4. Critical Buttons Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => setShowReportForm(true)}
                    className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95"
                >
                    <AlertOctagon className="w-6 h-6 animate-pulse" /> REPORT LOCAL FLOODING
                </button>
                <button
                    onClick={() => setShowPublicMap(true)}
                    className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
                >
                    <MapIcon className="w-6 h-6" /> OPEN EVACUATION MAP
                </button>
            </div>

            {/* 3. Key Metrics */}
            <InfoCardsGrid
                rainfall={floodData?.rainfall}
                weather={floodData?.weather}
                status={floodData?.status}
                timestamp={floodData?.timestamp}
            />

            {/* 4. Primary Actions */}
            <QuickActionsGrid onAction={(action) => {
                if (action === 'MAP') setShowPublicMap(true);
                if (action === 'ALERTS') setShowAlertForm(true);
            }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 5. Recent Alerts */}
                <div>
                    <AlertsFeed />
                </div>

                {/* 6. Education / Safety */}
                <div>
                    <SafetyTipsAccordion />
                </div>
            </div>

            {/* Report Form Overlay */}
            {showReportForm && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportForm(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            {/* Close Button Inside for Mobile */}
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

            {/* Public Map Overlay */}
            {showPublicMap && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPublicMap(false)}></div>
                    <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <MapIcon className="text-sky-500" /> Evacuation & Shelters
                            </h3>
                            <button
                                onClick={() => setShowPublicMap(false)}
                                className="p-2 hover:bg-slate-100 rounded-full"
                            >
                                <X className="w-5 h-5 text-slate-400" />
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

            {/* Alert Subscription Overlay */}
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
