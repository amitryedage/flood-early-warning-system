import React from 'react';
import { AlertTriangle, TrendingUp, X } from 'lucide-react';

const CriticalAlertBanner: React.FC = () => {
    // In a real app, this would be controlled by props or context
    const isCritical = true;

    if (!isCritical) return null;

    return (
        <div className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg shadow-red-500/20 mb-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] pointer-events-none"></div>

            <div className="relative z-10 p-5 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Left: Alert Info */}
                <div className="flex-1 flex items-start gap-4">
                    <div className="p-3 bg-red-800/30 rounded-full animate-pulse border border-red-400/30">
                        <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold tracking-tight">CRITICAL ALERT</h2>
                            <span className="px-2 py-0.5 bg-white/20 text-xs font-semibold rounded uppercase tracking-wider">Godavari River</span>
                        </div>
                        <p className="text-red-100 text-sm leading-relaxed max-w-2xl">
                            Water level at <span className="font-bold text-white">95% (Critical)</span> and rising.
                            Predicted to breach safe limits by <span className="font-bold text-white">14:00 today</span>.
                            Immediate evacuation recommended for <span className="font-bold text-white underline decoration-red-300 underline-offset-2">12 villages</span>.
                        </p>
                    </div>
                </div>

                {/* Middle: Stats */}
                <div className="hidden lg:flex items-center gap-6 px-6 border-l border-red-500/50 border-r">
                    <div className="text-center">
                        <div className="text-xs text-red-200 uppercase tracking-widest mb-1">Current Level</div>
                        <div className="text-2xl font-bold font-mono">15.9m</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-red-200 uppercase tracking-widest mb-1">Trend</div>
                        <div className="text-2xl font-bold font-mono flex items-center justify-center gap-1">
                            <TrendingUp className="w-5 h-5" /> +2.3m
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 bg-white text-red-700 font-bold rounded-lg hover:bg-red-50 transition-colors shadow-sm active:scale-95">
                        ⚡ BROADCAST ALERT
                    </button>
                    <button className="px-4 py-2.5 bg-red-800/20 border border-red-400/30 text-white rounded-lg hover:bg-red-800/40 transition-colors">
                        DETAILS
                    </button>
                    <button className="p-2 text-red-200 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CriticalAlertBanner;
