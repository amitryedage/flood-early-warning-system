import React from 'react';
import { CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatusBannerProps {
    status: 'safe' | 'warning' | 'critical';
    customTitle?: string;
    customSubtitle?: string;
    villageName?: string;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ status = 'safe', customTitle, customSubtitle, villageName }) => {

    const config = {
        safe: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-500',
            accent: 'bg-emerald-600',
            iconColor: 'text-emerald-500',
            titleColor: 'text-emerald-900',
            Icon: CheckCircle,
            title: 'YOU ARE SAFE',
            subtitle: 'Water Level: 45%',
            margin: 'Safe Margin',
            desc: 'No immediate threats in your sector.',
            primaryBtn: 'Mark Safe for Family',
        },
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-500',
            accent: 'bg-amber-600',
            iconColor: 'text-amber-500',
            titleColor: 'text-amber-900',
            Icon: AlertTriangle,
            title: 'ELEVATED ALERT',
            subtitle: 'Water Level: 78%',
            margin: 'Monitor Closely',
            desc: 'Water levels rising +0.5m/hr.',
            primaryBtn: 'Prepare Now',
        },
        critical: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            accent: 'bg-red-600',
            iconColor: 'text-red-500',
            titleColor: 'text-red-900',
            Icon: AlertOctagon,
            title: 'EVACUATE NOW',
            subtitle: 'Water Level: 95%',
            margin: 'CRITICAL',
            desc: 'Flood imminent. Move to higher ground!',
            primaryBtn: 'Start Evacuation',
        }
    };

    const current = config[status as keyof typeof config] || config.safe;

    return (
        <div className={`relative overflow-hidden rounded-3xl border-l-[8px] ${current.border} ${current.bg} p-8 md:p-10 shadow-lg shadow-gray-100 transition-all duration-500`}>
            {/* Background enhancement */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
                <div className="flex items-center gap-6 md:gap-8">
                    <div className={`p-5 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 ${current.iconColor} shrink-0`}>
                        <current.Icon className="w-10 h-10 md:w-14 md:h-14" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${current.accent}`}>
                                {villageName ? `Status: ${villageName}` : 'Global Status'}
                            </span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">• Updated 2m ago</span>
                        </div>
                        <h2 className={`text-3xl md:text-5xl font-black tracking-tighter ${current.titleColor} leading-none mb-3`}>
                            {customTitle || current.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <p className="text-lg md:text-xl font-bold text-gray-700">
                                {customSubtitle || current.subtitle} <span className="text-gray-400 font-medium">({current.margin})</span>
                            </p>
                            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            <p className="text-sm md:text-base text-gray-500 font-semibold tracking-tight">
                                {current.desc}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <button className={`flex-1 sm:flex-none px-10 py-5 rounded-2xl font-black shadow-xl transition-all active:scale-[0.98] text-center text-sm tracking-[0.1em] uppercase text-white ${current.accent} hover:brightness-110`}>
                        {current.primaryBtn}
                    </button>
                    <button className="flex-1 sm:flex-none px-10 py-5 rounded-2xl font-bold transition-all text-center text-sm tracking-wide bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200 shadow-sm active:scale-[0.98]">
                        View Surroundings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusBanner;
