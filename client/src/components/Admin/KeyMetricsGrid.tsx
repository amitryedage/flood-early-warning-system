import React from 'react';
import { AlertTriangle, Home, CheckCircle, Users, TrendingUp, TrendingDown, CloudRain } from 'lucide-react';
import type { MetricCardConfig } from '../../types/admin.types';

import { getWeather } from '../../services/weatherService';

const metrics: MetricCardConfig[] = [
    {
        id: '1',
        title: 'CRITICAL ALERTS',
        value: '3',
        subtitle: '234 people affected',
        icon: AlertTriangle,
        color: 'red',
        trend: 'up'
    },
    {
        id: '2',
        title: 'WARNING ALERTS',
        value: '8',
        subtitle: '567 people affected',
        icon: AlertTriangle,
        color: 'orange',
        trend: 'up'
    },
    {
        id: '3',
        title: 'AT-RISK VILLAGES',
        value: '12',
        subtitle: '245k population',
        icon: Home,
        color: 'yellow',
        trend: 'up'
    },
    {
        id: '4',
        title: 'SAFE ZONES',
        value: '42',
        subtitle: '156k secure',
        icon: CheckCircle,
        color: 'green',
        trend: 'neutral'
    },
    {
        id: '5',
        title: 'RESPONSE TEAMS',
        value: '5',
        subtitle: '75 members deployed',
        icon: Users,
        color: 'blue',
        trend: 'neutral'
    },
    {
        id: '6',
        title: 'CURRENT WEATHER',
        value: 'Loading...',
        subtitle: 'Local Conditions',
        icon: CloudRain,
        color: 'purple',
        trend: 'neutral'
    }
];

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

const KeyMetricsGrid: React.FC = () => {
    const [displayMetrics, setDisplayMetrics] = React.useState(metrics);

    React.useEffect(() => {
        const fetchWeather = async () => {
            // India Center coordinates or relevant location
            const data = await getWeather(20.5937, 78.9629);
            if (data) {
                setDisplayMetrics(prev => prev.map(m => {
                    if (m.id === '6') {
                        return {
                            ...m,
                            value: `${data.temp.toFixed(1)}°C`,
                            subtitle: `${data.condition}, Hum: ${data.humidity}%`,
                            trend: data.rainfall > 0 ? 'up' : 'neutral'
                        };
                    }
                    return m;
                }));
            } else {
                setDisplayMetrics(prev => prev.map(m => {
                    if (m.id === '6') {
                        return { ...m, value: 'N/A', subtitle: 'Service Unavailable' };
                    }
                    return m;
                }));
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 300000); // 5 mins
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {displayMetrics.map((metric) => (
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
                        <h3 className="text-3xl font-bold text-slate-800 mb-1">
                            {metric.value}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium truncate">
                            {metric.subtitle}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KeyMetricsGrid;
