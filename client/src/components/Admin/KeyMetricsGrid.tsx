import React from 'react';
import { AlertTriangle, Home, Users, TrendingUp, TrendingDown, CloudRain, Activity } from 'lucide-react';
import type { MetricCardConfig } from '../../types/admin.types';

const getColorClasses = (color: string) => {
    switch (color) {
        case 'red': return 'border-red-500/30 shadow-red-500/5';
        case 'orange': return 'border-orange-500/30 shadow-orange-500/5';
        case 'yellow': return 'border-amber-500/30 shadow-amber-500/5';
        case 'green': return 'border-emerald-500/30 shadow-emerald-500/5';
        case 'blue': return 'border-cyan-500/30 shadow-cyan-500/5';
        case 'purple': return 'border-purple-500/30 shadow-purple-500/5';
        default: return 'border-slate-200';
    }
};

const getIconBg = (color: string) => {
    switch (color) {
        case 'red': return 'bg-red-50 text-red-500';
        case 'orange': return 'bg-orange-50 text-orange-500';
        case 'yellow': return 'bg-amber-50 text-amber-500';
        case 'green': return 'bg-emerald-50 text-emerald-500';
        case 'blue': return 'bg-cyan-50 text-cyan-600';
        case 'purple': return 'bg-purple-50 text-purple-600';
        default: return 'bg-slate-100 text-slate-500';
    }
}

interface KeyMetricsGridProps {
    waterLevel: number;
    rainfall: number;
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    temperature: number | null;
}

const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({ waterLevel, rainfall, status, temperature }) => {
    const metrics_data: MetricCardConfig[] = [
        {
            id: '1',
            title: 'TACTICAL STATUS',
            value: status,
            subtitle: status === 'NORMAL' ? 'NOMINAL OPERATION' : 'ALERT PROTOCOL ACTIVE',
            icon: AlertTriangle,
            color: status === 'CRITICAL' ? 'red' : status === 'WARNING' ? 'orange' : 'green',
            trend: status === 'CRITICAL' ? 'up' : 'neutral'
        },
        {
            id: '2',
            title: 'BASIN DEPTH',
            value: `${waterLevel.toFixed(1)}m`,
            subtitle: `CAPACITY: ${((waterLevel - 10) / 5 * 100).toFixed(0)}%`,
            icon: TrendingUp,
            color: waterLevel > 14.5 ? 'red' : waterLevel > 13.0 ? 'orange' : 'blue',
            trend: 'up'
        },
        {
            id: '3',
            title: 'PRECIPITATION',
            value: `${rainfall.toFixed(0)}mm`,
            subtitle: 'REAL-TIME ISO-LINE',
            icon: CloudRain,
            color: 'blue',
            trend: rainfall > 50 ? 'up' : 'neutral'
        },
        {
            id: '4',
            title: 'SECTOR RISK',
            value: waterLevel > 14.5 ? '12 ZONES' : waterLevel > 13.0 ? '4 ZONES' : 'STABLE',
            subtitle: 'EVACUATION READINESS',
            icon: Home,
            color: waterLevel > 13 ? 'yellow' : 'green',
            trend: 'neutral'
        },
        {
            id: '5',
            title: 'ASSET DEPLOYMENT',
            value: waterLevel > 13 ? 'ACTIVE' : 'READY',
            subtitle: 'QRF UNITS SYNCED',
            icon: Users,
            color: 'blue',
            trend: 'neutral'
        },
        {
            id: '6',
            title: 'AMBIENT TEMP',
            value: temperature ? `${temperature.toFixed(1)}°C` : 'N/A',
            subtitle: 'SECTOR TELEMETRY',
            icon: Activity,
            color: 'purple',
            trend: 'neutral'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {metrics_data.map((metric) => (
                <div
                    key={metric.id}
                    className={`relative p-5 rounded-2xl border bg-white shadow-lg transition-all duration-500 hover:border-slate-300 hover:shadow-xl group ${getColorClasses(metric.color)}`}
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className={`p-3 rounded-xl transition-all group-hover:scale-110 ${getIconBg(metric.color)}`}>
                            <metric.icon className="w-5 h-5" />
                        </div>
                        <div className="flex gap-1">
                            {metric.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-red-500" />}
                            {metric.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />}
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 group-hover:text-slate-500 transition-colors">
                            {metric.title}
                        </p>
                        <h3 className="text-2xl font-black text-slate-800 mb-2 leading-none tracking-tighter">
                            {metric.value}
                        </h3>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest truncate">
                            {metric.subtitle}
                        </p>
                    </div>

                    {/* Tactical scanning line effect */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            ))}
        </div>
    );
};

export default KeyMetricsGrid;
