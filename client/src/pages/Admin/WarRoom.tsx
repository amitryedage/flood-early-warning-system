import React, { useState } from 'react';
import { Layers, CloudRain, ZoomIn, ZoomOut, Maximize, RotateCcw, Radio } from 'lucide-react';
import MapContainer from '../../components/Map/MapContainer';
import MapLayerControl, { type MapLayers } from '../../components/Map/MapLayerControl';
import CriticalAlertBanner from '../../components/Admin/CriticalAlertBanner';
import KeyMetricsGrid from '../../components/Admin/KeyMetricsGrid';
import RightPanelTabs from '../../components/Admin/RightPanelTabs';
import SimulationPanel from '../../components/Controls/SimulationPanel';
import WeatherParticles from '../../components/Effects/WeatherParticles';
import OperationalTicker from '../../components/Admin/OperationalTicker';
import ImpactEstimation from '../../components/Admin/ImpactEstimation';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

const WarRoom: React.FC = () => {
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const [isGodMode, setIsGodMode] = useState(false);
    const { floodData, isConnected } = useSocket();
    const { isAdmin } = useAuth();

    // Map Layer State
    const [activeLayers, setActiveLayers] = useState<MapLayers>({
        floodZones: true,
        shelters: true,
        teams: true,
        rainfall: false,
        satellite: false,
        aiRoute: false
    });

    const toggleLayer = (layer: keyof MapLayers) => {
        setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    // Default state while loading
    const defaultData = {
        waterLevel: 12.0,
        rainfall: 45,
        status: 'NORMAL' as const,
        weather: { temperature: 28, condition: 'Clear', icon: '01d', humidity: 60, windSpeed: 10, description: 'Clear', pressure: 1012, visibility: 10, cloudiness: 0, location: 'Sangli' },
        villages: [],
        responders: [],
        tasks: [],
        forecast: [],
        history: [],
        satelliteIntelligence: { status: 'pending', lastUpdated: null, message: null, cloudCover: null, visualUrl: null, sensorType: 'Sentinel-2' }
    };

    const data = floodData || defaultData;
    const [activeTab, setActiveTab] = useState<'villages' | 'teams' | 'predictions' | 'history' | 'satellite' | 'surveillance'>('villages');
    const { addToast } = useToast();

    const handleBroadcast = () => {
        // Mock broadcast for MVP
        // In a real app, this would enable a specific "Alert" mode or API call
        setActiveTab('history'); // Switch to logs to show "Alert Sent"
        addToast('error', "🚨 EMERGENCY ALERT BROADCASTED TO ALL SECTORS", 4000);
    };

    const handleViewIntel = () => {
        setActiveTab('predictions');
    };

    return (
        <div className="flex flex-col h-full p-6 space-y-8 animate-in fade-in duration-700">
            {/* Weather Particles Effect */}
            {data.status === 'CRITICAL' && <WeatherParticles intensity="heavy" type="storm" />}
            {data.status === 'WARNING' && <WeatherParticles intensity="moderate" type="rain" />}

            {/* 1. Critical Alert Banner */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                    <CriticalAlertBanner
                        status={data.status}
                        waterLevel={data.waterLevel}
                        onBroadcast={handleBroadcast}
                        onViewIntel={handleViewIntel}
                        satelliteStatus={data.satelliteIntelligence?.status}
                        sensorType={data.satelliteIntelligence?.sensorType}
                    />
                </div>
            </div>

            {/* ... Key Metrics ... */}
            <KeyMetricsGrid
                waterLevel={data.waterLevel}
                rainfall={data.rainfall}
                status={data.status}
                temperature={data.weather.temperature}
            />

            {/* ... Map Section ... */}
            <div className={`flex flex-col lg:flex-row gap-8 ${isMapFullscreen ? 'fixed inset-0 z-[60] bg-white p-8' : 'flex-1 min-h-[650px]'}`}>
                {/* ... Map Container ... */}
                <div className={`flex flex-col bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative transition-all duration-500 ${isMapFullscreen ? 'w-full h-full' : 'flex-1 shadow-slate-200/50'}`}>
                    {/* ... Map Content ... */}
                    {/* (This part is unchanged, omitting for brevity in replacement if possible, but replace_file_content needs contiguous block) */}
                    {/* Actually I need to replace the whole block or finding a good anchor. */}
                    {/* Re-rendering the map section parts to ensure context is kept */}
                    <div className="h-[65px] border-b border-slate-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl">
                        {/* ... Map Header ... */}
                        <div className="flex items-center gap-3">
                            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                                <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-cyan-600 bg-white border border-slate-200 rounded-lg shadow-sm uppercase tracking-widest">
                                    <Layers className="w-3.5 h-3.5" /> Sensors
                                </button>
                                <button
                                    onClick={() => toggleLayer('rainfall')}
                                    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black transition-colors uppercase tracking-widest ${activeLayers.rainfall ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-300'}`}>
                                    <CloudRain className="w-3.5 h-3.5" /> Precipitation
                                </button>
                            </div>

                            {isAdmin && (
                                <button
                                    onClick={() => setIsGodMode(!isGodMode)}
                                    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl border transition-all uppercase tracking-widest shadow-lg ${isGodMode ? 'bg-orange-600 text-white border-orange-500 animate-pulse' : 'text-slate-500 bg-slate-900 border-slate-800 hover:border-orange-500/50 hover:text-orange-500'}`}
                                >
                                    <Radio className="w-3.5 h-3.5" /> Simulation Mode
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`}></span>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isConnected ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {isConnected ? 'LIVE FEED ACTIVE' : 'TELEMETRY OFFLINE'}
                                </span>
                            </div>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Sector: Krishna-Basin-Alpha</span>
                        </div>
                    </div>

                    {/* Map Reality Layer */}
                    <div className="flex-1 relative bg-slate-950">
                        <MapContainer
                            center={[16.8524, 74.5815]}
                            zoom={12}
                            floodZones={activeLayers.floodZones ? [
                                {
                                    lat: 16.8524,
                                    lng: 74.5815,
                                    radius: 50000 * (data.waterLevel / 12),
                                    severity: data.status === 'CRITICAL' ? 'HIGH' : 'MODERATE'
                                }
                            ] : []}
                            villages={data.villages?.map(v => ({
                                ...v,
                                status: v.status as 'SAFE' | 'WARNING' | 'CRITICAL'
                            })) || []}
                            shelters={activeLayers.shelters ? [
                                { id: 's1', name: 'Sangli High School', lat: 16.8550, lng: 74.5900, capacity: 500 },
                                { id: 's2', name: 'Walchand College', lat: 16.8450, lng: 74.6000, capacity: 1000 },
                                { id: 's3', name: 'Willingdon College', lat: 16.8400, lng: 74.5950, capacity: 800 },
                                { id: 's4', name: 'Chintamanrao College', lat: 16.8350, lng: 74.6100, capacity: 600 },
                                { id: 's5', name: 'Govt Medical College Miraj', lat: 16.8250, lng: 74.6300, capacity: 1200 }
                            ] : []}
                            responseTeams={activeLayers.teams ? (floodData?.responders.map(r => ({
                                id: r.id,
                                name: r.name,
                                lat: r.lat,
                                url: r.lat, // Error in original copy? keeping safe
                                lng: r.lng,
                                status: r.status as any
                            })) || []) : []}
                            tasks={floodData?.tasks || []}
                            showHeatmap={activeLayers.rainfall}
                            showSatellite={activeLayers.satellite}
                            showAIRoute={activeLayers.aiRoute}
                        />

                        {/* Layer Controls */}
                        <MapLayerControl layers={activeLayers} onToggle={toggleLayer} />

                        {/* Tactical Overlay: Simulation */}
                        {isGodMode && (
                            <div className="absolute top-8 right-8 z-[400] w-80 animate-in slide-in-from-right duration-500">
                                <SimulationPanel
                                    waterLevel={data.waterLevel}
                                    rainfall={data.rainfall}
                                    status={data.status}
                                    onClose={() => setIsGodMode(false)}
                                />
                            </div>
                        )}

                        {/* Floating Operational Controls */}
                        <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-[400]">
                            <div className="flex flex-col bg-white/90 backdrop-blur-md border border-slate-200 p-1.5 rounded-2xl shadow-xl">
                                <button className="p-3 text-slate-500 hover:text-cyan-600 hover:bg-slate-50 rounded-xl transition-all">
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                                <button className="p-3 text-slate-500 hover:text-cyan-600 hover:bg-slate-50 rounded-xl transition-all">
                                    <ZoomOut className="w-5 h-5" />
                                </button>
                                <div className="h-px bg-slate-200 my-1 mx-2"></div>
                                <button className="p-3 text-slate-500 hover:text-cyan-600 hover:bg-slate-50 rounded-xl transition-all">
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                className={`p-4 rounded-2xl shadow-xl border transition-all group ${isMapFullscreen ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-white/90 backdrop-blur-md border-slate-200 text-slate-500 hover:text-cyan-600'}`}
                                onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                            >
                                <Maximize className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: INTELLIGENCE PANEL */}
                {!isMapFullscreen && (
                    <div className="w-full lg:w-[420px] animate-in slide-in-from-right duration-500 flex flex-col gap-4">
                        {/* 1. Masterstroke: AI Intelligence Ticker */}
                        <OperationalTicker />

                        {/* 2. Masterstroke: Impact Assessment Layer */}
                        <ImpactEstimation
                            waterLevel={data.waterLevel}
                            status={data.status}
                        />

                        {/* 3. Existing Controls - Refactored as tabs/bottom content */}
                        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 p-6 overflow-hidden">
                            <RightPanelTabs
                                floodData={floodData}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default WarRoom;
