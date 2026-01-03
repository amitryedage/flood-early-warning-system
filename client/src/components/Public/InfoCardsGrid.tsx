import React from 'react';
import { MapPin, CloudRain, TrendingUp, Clock, RefreshCw, Waves } from 'lucide-react';

const InfoCardsGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
            {/* Card 1 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" /> Distance to River
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">2.5 km</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">Safe Margin</div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <CloudRain className="w-3.5 h-3.5" /> Rainfall (24h)
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">45 mm</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Moderate Intensity</div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" /> Trend
                </div>
                <div className="text-xl md:text-2xl font-bold text-emerald-600 flex items-center gap-1">
                    Stable <span>→</span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Since last 4 hours</div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" /> Time to Critical
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">24+ hrs</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">Est. Safety Window</div>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <RefreshCw className="w-3.5 h-3.5" /> Update Freq
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">5 min</div>
                <div className="text-xs text-blue-600 font-medium mt-1 animate-pulse">Live Monitoring</div>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Waves className="w-3.5 h-3.5" /> River Status
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">Godavari</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Flow: Normal</div>
            </div>
        </div>
    );
};

export default InfoCardsGrid;
