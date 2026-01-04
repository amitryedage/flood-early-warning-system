import React from 'react';

interface ThreatGaugeProps {
    waterLevel?: number;
}

const ThreatGauge: React.FC<ThreatGaugeProps> = ({ waterLevel }) => {
    // Calculate level percentage based on water level (10-15m range)
    // 10m = 0%, 15m = 100%
    const calculateLevel = (wl?: number) => {
        if (!wl) return 45; // Default fallback
        const minLevel = 10;
        const maxLevel = 15;
        const percentage = ((wl - minLevel) / (maxLevel - minLevel)) * 100;
        return Math.max(0, Math.min(100, percentage));
    };

    const level = calculateLevel(waterLevel);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Flood Risk in Your Area</h3>

            {/* Main Gauge */}
            <div className="relative h-4 bg-slate-100/50 rounded-full overflow-hidden mb-8 shadow-inner border border-slate-50">
                {/* Background Segments */}
                <div className="absolute inset-0 flex opacity-10">
                    <div className="w-[40%] bg-emerald-500"></div>
                    <div className="w-[30%] bg-yellow-500"></div>
                    <div className="w-[20%] bg-orange-500"></div>
                    <div className="w-[10%] bg-red-500"></div>
                </div>

                {/* Fill Bar */}
                <div
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)] border-r-2 border-white/30"
                    style={{ width: `${level}%` }}
                ></div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Your Location</span>
                    <span className="font-black text-slate-800 flex items-center gap-2 text-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-emerald-100"></span>
                        {level.toFixed(0)}% (Safe)
                    </span>
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-emerald-500/80 w-[45%]" style={{ width: `${level}%` }}></div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Critical Limit</span>
                    <span className="font-black text-slate-800 flex items-center gap-2 text-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-red-100"></span>
                        95% (Evacuate)
                    </span>
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-3 relative overflow-hidden">
                        <div className="absolute right-0 top-0 bottom-0 w-[5%] bg-red-500/80"></div>
                        <div className="absolute right-[5%] top-0 bottom-0 w-[1px] bg-red-200"></div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Forecast (24h)</span>
                    <span className="font-black text-slate-800 text-sm">
                        Stability Estimate
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 leading-tight">24+ hrs to critical levels</span>
                </div>
            </div>
        </div>
    );
};

export default ThreatGauge;
