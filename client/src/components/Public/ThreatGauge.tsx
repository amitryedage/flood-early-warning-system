import React from 'react';

const ThreatGauge: React.FC = () => {
    // Current level (0-100)
    const level = 45;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Flood Risk in Your Area</h3>

            {/* Main Gauge */}
            <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden mb-6">
                {/* Background Segments */}
                <div className="absolute inset-0 flex opacity-20">
                    <div className="w-[40%] bg-emerald-500"></div>
                    <div className="w-[30%] bg-yellow-500"></div>
                    <div className="w-[15%] bg-orange-500"></div>
                    <div className="w-[15%] bg-red-500"></div>
                </div>

                {/* Fill Bar */}
                <div
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    style={{ width: `${level}%` }}
                ></div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs mb-1">Your Location</span>
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        45% (Safe)
                    </span>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[45%]"></div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs mb-1">Critical Limit</span>
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        95% (Evacuate)
                    </span>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 relative">
                        <div className="absolute right-0 top-0 bottom-0 w-[5%] bg-red-500"></div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs mb-1">Forecast (24h)</span>
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                        Stability Estimate
                    </span>
                    <span className="text-xs text-slate-500">24+ hrs to critical levels</span>
                </div>
            </div>
        </div>
    );
};

export default ThreatGauge;
