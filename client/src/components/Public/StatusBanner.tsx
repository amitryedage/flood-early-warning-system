import React from 'react';
import { CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatusBannerProps {
    status: 'safe' | 'warning' | 'critical';
}

const StatusBanner: React.FC<StatusBannerProps> = ({ status = 'safe' }) => {

    // Status Configuration
    const config = {
        safe: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-500',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            titleColor: 'text-emerald-800',
            Icon: CheckCircle,
            title: 'YOU ARE SAFE',
            subtitle: 'Water Level: 45% (Safe Margin)',
            desc: 'No immediate threats in your sector.',
            buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
            secondaryButtonClass: 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
        },
        warning: {
            bg: 'bg-orange-50',
            border: 'border-orange-500',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            titleColor: 'text-orange-800',
            Icon: AlertTriangle,
            title: 'ELEVATED ALERT',
            subtitle: 'Water Level: 78% (Monitor Closely)',
            desc: 'Water levels rising +0.5m/hr.',
            buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
            secondaryButtonClass: 'text-orange-700 bg-orange-100 hover:bg-orange-200'
        },
        critical: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            titleColor: 'text-red-800',
            Icon: AlertOctagon,
            title: 'EVACUATE NOW',
            subtitle: 'Water Level: 95% (CRITICAL)',
            desc: 'Flood imminent. Move to higher ground!',
            buttonClass: 'bg-red-600 hover:bg-red-700 text-white animate-pulse',
            secondaryButtonClass: 'text-red-700 bg-red-100 hover:bg-red-200'
        }
    };

    const current = config[status];

    return (
        <div className={`relative overflow-hidden rounded-xl border-l-4 ${current.border} ${current.bg} p-6 mb-6 shadow-sm transition-all duration-500`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                {/* Left: Icon & Text */}
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${current.iconBg} ${current.iconColor} shadow-sm shrink-0`}>
                        <current.Icon className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div>
                        <h2 className={`text-xl md:text-2xl font-black tracking-tight ${current.titleColor} mb-1`}>
                            {current.title}
                        </h2>
                        <div className="flex flex-col gap-1">
                            <p className="font-bold text-slate-700">{current.subtitle}</p>
                            <p className="text-sm text-slate-600">
                                {current.desc} • <span className="text-xs opacity-75">Updated: 2m ago</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <button className={`px-6 py-3 rounded-lg font-bold shadow-sm transition-transform active:scale-95 text-center ${current.buttonClass}`}>
                        {status === 'critical' ? 'Start Evacuation' : status === 'warning' ? 'prepare to Evacuate' : 'Mark Safe for Family'}
                    </button>
                    <button className={`px-6 py-3 rounded-lg font-semibold transition-colors text-center ${current.secondaryButtonClass}`}>
                        View Surroundings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusBanner;
