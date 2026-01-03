import React, { useState } from 'react';
import { Layers, CloudRain, Activity, Database, ZoomIn, ZoomOut, Maximize, RotateCcw, RefreshCw } from 'lucide-react';
import MapContainer from '../../components/Map/MapContainer';
import CriticalAlertBanner from '../../components/Admin/CriticalAlertBanner';
import KeyMetricsGrid from '../../components/Admin/KeyMetricsGrid';
import RightPanelTabs from '../../components/Admin/RightPanelTabs';

const WarRoom: React.FC = () => {
    // Search/Filter state could live here or in context
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);

    return (
        <div className="flex flex-col h-full space-y-6">

            {/* 1. Critical Alert Banner (Conditional) */}
            <CriticalAlertBanner />

            {/* 2. Key Metrics Grid */}
            <KeyMetricsGrid />

            {/* 3. Main Content Split: Map (70%) & Details (30%) */}
            <div className={`flex flex-col lg:flex-row gap-6 ${isMapFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : 'flex-1 min-h-[600px]'}`}>

                {/* LEFT: MAP SECTION */}
                <div className={`flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative transition-all duration-300 ${isMapFullscreen ? 'w-full h-full' : 'flex-1'}`}>

                    {/* Map Header Controls */}
                    <div className="h-[50px] border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-sky-600 transition-colors">
                                <Layers className="w-3.5 h-3.5" /> Stations
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-sky-600 transition-colors">
                                <CloudRain className="w-3.5 h-3.5" /> Rainfall
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-sky-600 transition-colors">
                                <Activity className="w-3.5 h-3.5" /> Predictions
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-sky-600 transition-colors">
                                <Database className="w-3.5 h-3.5" /> Data
                            </button>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                            LIVE UPDATES ON
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="flex-1 relative bg-slate-100">
                        <MapContainer
                            center={[20.5937, 78.9629]}
                            zoom={5}
                            floodZones={[
                                { lat: 20.5937, lng: 78.9629, radius: 250000, severity: 'HIGH' },
                                { lat: 19.0760, lng: 72.8777, radius: 150000, severity: 'MODERATE' } // Mumbai
                            ]}
                            villages={[
                                { id: 'v1', name: 'Rampur', lat: 20.6, lng: 79.0, status: 'CRITICAL' },
                                { id: 'v2', name: 'Shyamnagar', lat: 20.5, lng: 78.9, status: 'WARNING' },
                                { id: 'v3', name: 'Safe Haven', lat: 20.4, lng: 78.8, status: 'SAFE' }
                            ]}
                            shelters={[
                                { id: 's1', name: 'Community Center', lat: 20.55, lng: 78.95, capacity: 500 },
                                { id: 's2', name: 'High School', lat: 20.45, lng: 78.85, capacity: 1000 }
                            ]}
                            responseTeams={[
                                { id: 't1', name: 'NDRF Team A', lat: 20.58, lng: 78.98, status: 'AVAILABLE' },
                                { id: 't2', name: 'Fire Rescue 1', lat: 20.52, lng: 78.92, status: 'BUSY' }
                            ]}
                        />

                        {/* Floating Map Controls */}
                        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[400]">
                            <button className="p-2 bg-white text-slate-600 rounded-lg shadow-md hover:bg-slate-50 border border-slate-200">
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-white text-slate-600 rounded-lg shadow-md hover:bg-slate-50 border border-slate-200">
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-white text-slate-600 rounded-lg shadow-md hover:bg-slate-50 border border-slate-200 my-2">
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-white text-slate-600 rounded-lg shadow-md hover:bg-slate-50 border border-slate-200" onClick={() => window.location.reload()}>
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                className={`p-2 bg-white text-slate-600 rounded-lg shadow-md hover:bg-slate-50 border border-slate-200 ${isMapFullscreen ? 'text-blue-600 bg-blue-50' : ''}`}
                                onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                            >
                                <Maximize className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: TABS & DETAILS */}
                {/* Hidden in fullscreen mode */}
                {!isMapFullscreen && (
                    <div className="w-full lg:w-[380px] h-[600px]">
                        <RightPanelTabs />
                    </div>
                )}

            </div>
        </div>
    );
};

export default WarRoom;
