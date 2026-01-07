import React from 'react';
import { AlertTriangle, TrendingUp, X, Satellite } from 'lucide-react';

interface CriticalAlertBannerProps {
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    waterLevel: number;
    onBroadcast?: () => void;
    onViewIntel?: () => void;
    satelliteStatus?: string;
    sensorType?: string;
}

const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({ status, waterLevel, onBroadcast, onViewIntel, satelliteStatus, sensorType }) => {
    if (status === 'NORMAL') return null;

    const isCritical = status === 'CRITICAL';

    return (
        <div className={`w-full text-white rounded-3xl shadow-2xl mb-8 relative overflow-hidden transition-all duration-700 border ${isCritical ? 'bg-red-950/40 border-red-500/30' : 'bg-orange-950/40 border-orange-500/30'}`}>
            <div className={`absolute inset-0 opacity-20 ${isCritical ? 'bg-red-600' : 'bg-orange-500'} blur-[100px] -z-10`}></div>

            <div className="relative z-10 p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left: Tactical Info */}
                <div className="flex-1 flex items-start gap-5">
                    <div className={`p-4 rounded-2xl animate-pulse border-2 shadow-2xl ${isCritical ? 'bg-red-600/20 border-red-500' : 'bg-orange-600/20 border-orange-500'}`}>
                        <AlertTriangle className={`w-10 h-10 ${isCritical ? 'text-red-500' : 'text-orange-500'}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">{isCritical ? 'Critical Anomaly Detected' : 'Operational Warning'}</h2>
                            <span className="px-3 py-1 bg-[#020617] text-[10px] font-black rounded-lg border border-slate-800 uppercase tracking-[0.2em] text-cyan-500">Sector Delta-4</span>
                            {satelliteStatus === 'success' && (
                                <span className={`px-3 py-1 ${sensorType?.includes('Radar') ? 'bg-indigo-950 border-indigo-400' : 'bg-indigo-950/60 border-indigo-500/50'} text-[10px] font-black rounded-lg border uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2`}>
                                    <Satellite className="w-3 h-3" /> {sensorType?.includes('Radar') ? 'Radar Verified (All-Weather)' : 'Satellite Verified'}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-300 text-sm font-semibold leading-relaxed max-w-2xl uppercase tracking-tight">
                            Telemetry alert: Water level at <span className={`font-black ${isCritical ? 'text-red-500' : 'text-orange-500'}`}>{waterLevel.toFixed(1)}m</span>.
                            {isCritical
                                ? ' Execute immediate phase 4 evacuation protocols. All response units active.'
                                : ' Level 2 surveillance required. Monitoring seasonal basin trends.'}
                        </p>
                    </div>
                </div>

                {/* Middle: Tactical Telemetry */}
                <div className="hidden lg:flex items-center gap-10 px-10 border-l border-slate-800 border-r border-slate-800">
                    <div className="text-center">
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Depth Telemetry</div>
                        <div className="text-3xl font-black font-mono tracking-tighter text-white">{waterLevel.toFixed(1)}M</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Delta Shift</div>
                        <div className="text-3xl font-black font-mono tracking-tighter flex items-center justify-center gap-2 text-white">
                            <TrendingUp className={`w-6 h-6 ${isCritical ? 'text-red-500' : 'text-orange-500'}`} /> {isCritical ? '+0.05' : '+0.01'}
                        </div>
                    </div>
                </div>

                {/* Right: Operational Actions */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={onBroadcast}
                        className={`flex-1 md:flex-none whitespace-nowrap px-8 py-3 font-black rounded-xl transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs border ${isCritical ? 'bg-red-600 border-red-500 hover:bg-red-500 text-white' : 'bg-orange-600 border-orange-500 hover:bg-orange-500 text-white'}`}>
                        Broadcast Alert
                    </button>
                    <button
                        onClick={onViewIntel}
                        className="px-6 py-3 bg-[#020617] border border-slate-800 text-slate-300 font-black rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] uppercase tracking-widest">
                        Intelligence
                    </button>
                    <button className="p-3 text-slate-600 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CriticalAlertBanner;
