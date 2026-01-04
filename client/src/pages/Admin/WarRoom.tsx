import React, { useState } from 'react';
import { Layers, CloudRain, ZoomIn, ZoomOut, Maximize, RotateCcw, Radio } from 'lucide-react';
import MapContainer from '../../components/Map/MapContainer';
import CriticalAlertBanner from '../../components/Admin/CriticalAlertBanner';
import KeyMetricsGrid from '../../components/Admin/KeyMetricsGrid';
import RightPanelTabs from '../../components/Admin/RightPanelTabs';
import SimulationPanel from '../../components/Controls/SimulationPanel';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';

const WarRoom: React.FC = () => {
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const [isGodMode, setIsGodMode] = useState(false);
    const { floodData, isConnected } = useSocket();
    const { isAdmin } = useAuth();

    // Default state while loading
    const defaultData = {
        waterLevel: 12.0,
        rainfall: 45,
        status: 'NORMAL' as const,
        weather: { temperature: 28, condition: 'Clear', icon: '01d' }
    };

    const data = floodData || defaultData;

    return (
        <div className="flex flex-col h-full space-y-6">

            {/* 1. Critical Alert Banner (Conditional) */}
            <CriticalAlertBanner status={data.status} waterLevel={data.waterLevel} />

            {/* 2. Key Metrics Grid - Now Live */}
            <KeyMetricsGrid
                waterLevel={data.waterLevel}
                rainfall={data.rainfall}
                status={data.status}
                temperature={data.weather.temperature}
            />

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
                            {isAdmin && (
                                <button
                                    onClick={() => setIsGodMode(!isGodMode)}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${isGodMode ? 'bg-orange-500 text-white border-orange-600 shadow-sm' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50 hover:text-orange-600'}`}
                                >
                                    <Radio className={`w-3.5 h-3.5 ${isGodMode ? 'animate-pulse' : ''}`} /> GOD MODE
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'}`}></span>
                            <span className={isConnected ? 'text-emerald-600' : 'text-red-600'}>
                                {isConnected ? 'Live Sync Active' : 'Offline'}
                            </span>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="flex-1 relative bg-slate-100">
                        <MapContainer
                            center={[18.0, 82.0]} // Godavari Basin
                            zoom={8}
                            floodZones={[
                                {
                                    lat: 18.0,
                                    lng: 82.0,
                                    radius: 50000 * (data.waterLevel / 12),
                                    severity: data.status === 'CRITICAL' ? 'HIGH' : 'MODERATE'
                                }
                            ]}
                            villages={[
                                {
                                    id: 'v1',
                                    name: 'Rampur',
                                    lat: 18.1,
                                    lng: 82.1,
                                    status: data.status === 'NORMAL' ? 'SAFE' : data.status
                                },
                                {
                                    id: 'v2',
                                    name: 'Shyamnagar',
                                    lat: 17.9,
                                    lng: 81.9,
                                    status: data.waterLevel > 14 ? 'CRITICAL' : 'SAFE'
                                },
                                {
                                    id: 'v3',
                                    name: 'Safe Haven',
                                    lat: 18.2,
                                    lng: 82.3,
                                    status: 'SAFE'
                                }
                            ]}
                            shelters={[
                                { id: 's1', name: 'Community Center', lat: 18.05, lng: 82.05, capacity: 500 },
                                { id: 's2', name: 'High School', lat: 17.85, lng: 81.85, capacity: 1000 }
                            ]}
                            responseTeams={floodData?.responders.map(r => ({
                                id: r.id,
                                name: r.name,
                                lat: r.lat,
                                lng: r.lng,
                                status: r.status as any
                            })) || []}
                            tasks={floodData?.tasks || []}
                        />

                        {/* Simulation Controls Overlay (God Mode) */}
                        {isGodMode && (
                            <div className="absolute top-6 right-6 z-[400] w-72">
                                <SimulationPanel
                                    waterLevel={data.waterLevel}
                                    rainfall={data.rainfall}
                                    status={data.status}
                                />
                            </div>
                        )}

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
                {!isMapFullscreen && (
                    <div className="w-full lg:w-[380px] h-[600px]">
                        <RightPanelTabs floodData={floodData} />
                    </div>
                )}

            </div>
        </div>
    );
};

export default WarRoom;
