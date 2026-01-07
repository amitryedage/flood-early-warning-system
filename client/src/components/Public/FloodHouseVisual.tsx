import React, { useState, useEffect } from 'react';
import { HelpCircle, Play, RefreshCw } from 'lucide-react';

interface FloodHouseVisualProps {
    waterLevel: number; // 10-15 meters
}

const FloodHouseVisual: React.FC<FloodHouseVisualProps> = ({ waterLevel: liveLevel }) => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [simLevel, setSimLevel] = useState(liveLevel);

    useEffect(() => {
        if (!isSimulating) {
            setSimLevel(liveLevel);
        }
    }, [liveLevel, isSimulating]);

    const activeLevel = isSimulating ? simLevel : liveLevel;
    // Calculate flood percentage (10m = 0%, 15m = 100%)
    const floodPercentage = Math.min(100, Math.max(0, ((activeLevel - 10) / 5) * 100));

    return (
        <div className="flex flex-col gap-4">
            <div className="relative w-full h-64 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl group border border-slate-800">
                {/* Sky/Background */}
                <div className={`absolute inset-0 transition-colors duration-1000 ${floodPercentage > 70 ? 'bg-slate-900' : 'bg-gradient-to-b from-sky-400 via-sky-200 to-blue-200'}`}></div>

                {/* Animated Clouds/Storm */}
                {floodPercentage > 50 && (
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                        <div className="absolute top-10 left-10 w-40 h-10 bg-white rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute top-20 right-20 w-60 h-12 bg-slate-400 rounded-full blur-3xl animate-bounce"></div>
                    </div>
                )}

                {/* Sun */}
                {floodPercentage < 40 && (
                    <div className="absolute top-6 right-10 w-16 h-16 bg-yellow-300 rounded-full shadow-[0_0_50px_rgba(253,224,71,0.5)] animate-pulse"></div>
                )}

                {/* House Structure - Isometric Style */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-40 flex flex-col items-center justify-end z-10">
                    {/* Roof */}
                    <div className="relative w-40 h-16 mb-[-8px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 transform -skew-y-12 origin-bottom-left shadow-lg"></div>
                        <div className="absolute top-0 right-0 w-20 h-16 bg-gradient-to-bl from-red-500 to-red-700 transform skew-y-12 origin-bottom-right"></div>
                    </div>

                    {/* House Body */}
                    <div className="relative w-32 h-24 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 shadow-2xl">
                        {/* Door */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-gradient-to-b from-amber-800 to-amber-900 border border-amber-950"></div>

                        {/* Windows */}
                        <div className={`absolute top-3 left-3 w-6 h-6 border-2 border-slate-800 grid grid-cols-2 gap-[1px] transition-colors ${activeLevel > 11 ? 'bg-blue-500/50' : 'bg-sky-200'}`}>
                            <div className="bg-transparent border-[0.1px] border-slate-400/20"></div>
                            <div className="bg-transparent border-[0.1px] border-slate-400/20"></div>
                            <div className="bg-transparent border-[0.1px] border-slate-400/20"></div>
                            <div className="bg-transparent border-[0.1px] border-slate-400/20"></div>
                        </div>
                        <div className={`absolute top-3 right-3 w-6 h-6 border-2 border-slate-800 grid grid-cols-2 gap-[1px] transition-colors ${activeLevel > 11 ? 'bg-blue-500/50' : 'bg-sky-200'}`}>
                            <div className="bg-transparent border-[0.1px] border-slate-400/20"></div>
                            <div className="bg-transparent border-[0.1px] border-slate-400/20"></div>
                            <div className="bg-transparent border-[0.1px] border-slate-400/20"></div>
                            <div className="bg-transparent border-[0.1px] border-slate-400/20"></div>
                        </div>
                    </div>
                </div>

                {/* Ground/Grass */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-700 to-green-600 z-[5]"></div>

                {/* Rising Water */}
                <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-600/80 backdrop-blur-[2px] transition-all duration-700 ease-out z-[15]"
                    style={{ height: `${floodPercentage}%` }}
                >
                    {/* Water Surface Animation */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                    {/* Interior Flood Effect (Overlay on house if water too high) */}
                </div>

                {/* Overlays */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-xl flex items-center gap-2 ${isSimulating ? 'bg-orange-500 text-white animate-pulse' :
                        floodPercentage < 30 ? 'bg-emerald-500 text-white' :
                            floodPercentage < 60 ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'}`}>
                        {isSimulating && <Play className="w-3 h-3 fill-current" />}
                        {isSimulating ? 'SIMULATION MODE' : floodPercentage < 30 ? '✓ SAFE LEVEL' : floodPercentage < 60 ? '⚠ WARNING' : '🚨 EVACUATE'}
                    </div>
                </div>

                {/* Depth Meter */}
                <div className="absolute right-6 top-6 bottom-6 w-10 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl z-20 overflow-hidden flex flex-col items-center py-4">
                    <div
                        className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ${floodPercentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ height: `${floodPercentage}%` }}
                    ></div>
                    <span className="relative z-10 text-[10px] font-black text-white mix-blend-difference [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest">
                        {activeLevel.toFixed(1)} Meters
                    </span>
                </div>
            </div>

            {/* Simulation Controls */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <HelpCircle className="w-3 h-3" /> "What If" Simulation
                    </label>
                    <button
                        onClick={() => {
                            setIsSimulating(!isSimulating);
                            if (isSimulating) setSimLevel(liveLevel);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${isSimulating ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                        <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                        {isSimulating ? 'Reset to Live' : 'Start Simulation'}
                    </button>
                </div>

                <div className="relative pt-2">
                    <input
                        type="range"
                        min="10"
                        max="15"
                        step="0.1"
                        disabled={!isSimulating}
                        value={isSimulating ? simLevel : liveLevel}
                        onChange={(e) => setSimLevel(parseFloat(e.target.value))}
                        className={`w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-600 ${isSimulating ? 'bg-blue-100' : 'bg-slate-200 opacity-50'}`}
                    />
                    <div className="flex justify-between mt-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        <span>10M (Ground)</span>
                        <span>12.5M (Window)</span>
                        <span>15M (Roofline)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloodHouseVisual;
