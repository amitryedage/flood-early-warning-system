import React from 'react';
import { AlertTriangle, TrendingUp, X } from 'lucide-react';

interface CriticalAlertBannerProps {
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    waterLevel: number;
}

const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({ status, waterLevel }) => {
    if (status === 'NORMAL') return null;

    const isCritical = status === 'CRITICAL';

    return (
        <div className={`w-full text-white rounded-xl shadow-lg mb-6 relative overflow-hidden transition-all duration-500 ${isCritical ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-red-500/20' : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/20'
            }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] pointer-events-none"></div>

            <div className="relative z-10 p-5 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Left: Alert Info */}
                <div className="flex-1 flex items-start gap-4">
                    <div className={`p-3 rounded-full animate-pulse border ${isCritical ? 'bg-red-800/30 border-red-400/30' : 'bg-orange-800/30 border-orange-400/30'}`}>
                        <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold tracking-tight">{isCritical ? 'CRITICAL ALERT' : 'SYSTEM WARNING'}</h2>
                            <span className="px-2 py-0.5 bg-white/20 text-xs font-semibold rounded uppercase tracking-wider">Godavari River</span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed max-w-2xl">
                            The water level has reached <span className="font-bold">{waterLevel.toFixed(1)}m ({status})</span>.
                            {isCritical
                                ? ' Immediate evacuation recommended for low-lying areas. Response teams deployed.'
                                : ' Monitoring situation closely. Preparedness protocol initiated.'}
                        </p>
                    </div>
                </div>

                {/* Middle: Stats */}
                <div className="hidden lg:flex items-center gap-6 px-6 border-l border-white/20 border-r">
                    <div className="text-center">
                        <div className="text-xs text-white/70 uppercase tracking-widest mb-1">Current Level</div>
                        <div className="text-2xl font-bold font-mono">{waterLevel.toFixed(1)}m</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-white/70 uppercase tracking-widest mb-1">Trend</div>
                        <div className="text-2xl font-bold font-mono flex items-center justify-center gap-1 text-white">
                            <TrendingUp className="w-5 h-5" /> {isCritical ? '+0.05m/s' : '+0.01m/s'}
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 bg-white font-bold rounded-lg transition-colors shadow-sm active:scale-95 ${isCritical ? 'text-red-700 hover:bg-red-50' : 'text-orange-700 hover:bg-orange-50'
                        }`}>
                        ⚡ BROADCAST ALERT
                    </button>
                    <button className="px-4 py-2.5 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition-colors">
                        DETAILS
                    </button>
                    <button className="p-2 text-white/70 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CriticalAlertBanner;
