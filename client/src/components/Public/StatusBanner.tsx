import React from 'react';
import { CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatusBannerProps {
    status: 'safe' | 'warning' | 'critical';
}

const StatusBanner: React.FC<StatusBannerProps> = ({ status = 'safe' }) => {

    // Status Configuration
    const config = {
        safe: {
            bg: 'bg-emerald-50/50',
            border: 'border-emerald-500',
            iconBg: 'bg-emerald-100/50',
            iconColor: 'text-emerald-500',
            titleColor: 'text-emerald-900',
            Icon: CheckCircle,
            title: 'YOU ARE SAFE',
            subtitle: 'Water Level: 45% (Safe Margin)',
            desc: 'No immediate threats in your sector.',
            buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
            secondaryButtonClass: 'text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100'
        },
        warning: {
            bg: 'bg-orange-50/50',
            border: 'border-orange-500',
            iconBg: 'bg-orange-100/50',
            iconColor: 'text-orange-500',
            titleColor: 'text-orange-900',
            Icon: AlertTriangle,
            title: 'ELEVATED ALERT',
            subtitle: 'Water Level: 78% (Monitor Closely)',
            desc: 'Water levels rising +0.5m/hr.',
            buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
            secondaryButtonClass: 'text-orange-700 bg-orange-100/50 hover:bg-orange-100'
        },
        critical: {
            bg: 'bg-red-50/50',
            border: 'border-red-500',
            iconBg: 'bg-red-100/50',
            iconColor: 'text-red-500',
            titleColor: 'text-red-900',
            Icon: AlertOctagon,
            title: 'EVACUATE NOW',
            subtitle: 'Water Level: 95% (CRITICAL)',
            desc: 'Flood imminent. Move to higher ground!',
            buttonClass: 'bg-red-600 hover:bg-red-700 text-white animate-pulse',
            secondaryButtonClass: 'text-red-700 bg-red-100/50 hover:bg-red-100'
        }
    };

    const current = config[status as keyof typeof config] || config.safe;

    return (
        <div className={`relative overflow-hidden rounded-2xl border-l-[6px] ${current.border} ${current.bg} p-6 h-full shadow-sm transition-all duration-500 border border-slate-100`}>
            {/* Background pattern for premium feel */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -mr-16 -mt-16 blur-3xl text-white"></div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 relative z-10 h-full">

                {/* Left: Icon & Text */}
                <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${current.iconBg} ${current.iconColor} shadow-inner shrink-0 border border-white/50`}>
                        <current.Icon className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                    <div>
                        <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${current.titleColor} mb-1 italic`}>
                            {current.title}
                        </h2>
                        <div className="flex flex-col gap-0.5">
                            <p className="font-bold text-slate-700 text-sm md:text-base">{current.subtitle}</p>
                            <p className="text-xs md:text-sm text-slate-500 font-medium">
                                {current.desc} • <span className="opacity-75">Updated: 2m ago</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className={`px-8 py-4 rounded-xl font-black shadow-lg shadow-slate-200 transition-all active:scale-95 text-center text-sm tracking-wide uppercase ${current.buttonClass}`}>
                        {status === 'critical' ? 'Start Evacuation' : status === 'warning' ? 'Prepare Now' : 'Mark Safe for Family'}
                    </button>
                    <button className={`px-8 py-4 rounded-xl font-bold transition-all text-center text-sm border border-white/50 hover:shadow-md ${current.secondaryButtonClass}`}>
                        View Surroundings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusBanner;
