import React from 'react';
import { AlertTriangle, Home, Users, TrendingUp, TrendingDown, CloudRain, Activity } from 'lucide-react';
import type { MetricCardConfig } from '../../types/admin.types';



const getColorClasses = (color: string) => {
    switch (color) {
        case 'red': return 'from-red-500/10 to-red-500/5 border-red-200 text-red-700';
        case 'orange': return 'from-orange-500/10 to-orange-500/5 border-orange-200 text-orange-700';
        case 'yellow': return 'from-yellow-500/10 to-yellow-500/5 border-yellow-200 text-yellow-700';
        case 'green': return 'from-emerald-500/10 to-emerald-500/5 border-emerald-200 text-emerald-700';
        case 'blue': return 'from-blue-500/10 to-blue-500/5 border-blue-200 text-blue-700';
        case 'purple': return 'from-purple-500/10 to-purple-500/5 border-purple-200 text-purple-700';
        default: return 'from-slate-500/10 to-slate-500/5 border-slate-200 text-slate-700';
    }
};

const getIconBg = (color: string) => {
    switch (color) {
        case 'red': return 'bg-red-100 text-red-600';
        case 'orange': return 'bg-orange-100 text-orange-600';
        case 'yellow': return 'bg-yellow-100 text-yellow-600';
        case 'green': return 'bg-emerald-100 text-emerald-600';
        case 'blue': return 'bg-blue-100 text-blue-600';
        case 'purple': return 'bg-purple-100 text-purple-600';
        default: return 'bg-slate-100 text-slate-600';
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
            title: 'SYSTEM STATUS',
            value: status,
            subtitle: status === 'NORMAL' ? 'Optimal Environment' : 'Active Hazard Response',
            icon: AlertTriangle,
            color: status === 'CRITICAL' ? 'red' : status === 'WARNING' ? 'orange' : 'green',
            trend: status === 'CRITICAL' ? 'up' : 'neutral'
        },
        {
            id: '2',
            title: 'WATER LEVEL',
            value: `${waterLevel.toFixed(1)}m`,
            subtitle: `${((waterLevel - 10) / 5 * 100).toFixed(0)}% Capacity`,
            icon: TrendingUp,
            color: waterLevel > 14.5 ? 'red' : waterLevel > 13.0 ? 'orange' : 'blue',
            trend: 'up'
        },
        {
            id: '3',
            title: 'RAINFALL INTENSITY',
            value: `${rainfall.toFixed(0)}mm`,
            subtitle: 'Real-time Precipitation',
            icon: CloudRain,
            color: rainfall > 100 ? 'blue' : 'blue',
            trend: rainfall > 50 ? 'up' : 'neutral'
        },
        {
            id: '4',
            title: 'AT-RISK VILLAGES',
            value: waterLevel > 14.5 ? '12' : waterLevel > 13.0 ? '4' : '0',
            subtitle: 'Evacuation zones',
            icon: Home,
            color: waterLevel > 13 ? 'yellow' : 'green',
            trend: 'neutral'
        },
        {
            id: '5',
            title: 'RESPONSE TEAMS',
            value: waterLevel > 13 ? 'Active' : 'Standby',
            subtitle: 'NDRF / Fire Dept',
            icon: Users,
            color: 'blue',
            trend: 'neutral'
        },
        {
            id: '6',
            title: 'AMBIENT TEMP',
            value: temperature ? `${temperature.toFixed(1)}°C` : '---',
            subtitle: 'Local Station Data',
            icon: Activity,
            color: 'purple',
            trend: 'neutral'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {metrics_data.map((metric) => (
                <div
                    key={metric.id}
                    className={`relative p-4 rounded-xl border bg-gradient-to-br bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${getColorClasses(metric.color)}`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${getIconBg(metric.color)}`}>
                            <metric.icon className="w-5 h-5" />
                        </div>
                        {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                        {metric.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            {metric.title}
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1 lg:text-xl xl:text-2xl">
                            {metric.value}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium truncate">
                            {metric.subtitle}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KeyMetricsGrid;
