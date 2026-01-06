import React from 'react';
import { CloudRain, Thermometer, Activity, Clock } from 'lucide-react';

interface InfoCardsGridProps {
    rainfall?: number;
    weather?: {
        temp: number;
        condition: string;
    };
    status?: string;
    timestamp?: Date | string | number;
}

const InfoCardsGrid: React.FC<InfoCardsGridProps> = ({
    rainfall = 12.5,
    weather = { temp: 28, condition: 'Light Rain' },
    status = 'NORMAL',
    timestamp = new Date()
}) => {
    const metrics = [
        {
            label: 'Rainfall',
            value: `${rainfall}mm`,
            sub: 'Last 24 hours',
            icon: CloudRain,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: '+1.2mm'
        },
        {
            label: 'Temperature',
            value: `${weather.temp}°C`,
            sub: weather.condition,
            icon: Thermometer,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            trend: 'Stable'
        },
        {
            label: 'System Status',
            value: status,
            sub: 'Updated 2m ago',
            icon: Activity,
            color: status === 'NORMAL' ? 'text-emerald-600' : 'text-amber-600',
            bg: status === 'NORMAL' ? 'bg-emerald-50' : 'bg-amber-50',
            trend: 'Live'
        },
        {
            label: 'Last Update',
            value: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sub: new Date(timestamp).toLocaleDateString(),
            icon: Clock,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            trend: 'Sync OK'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, i) => (
                <div key={i} className="standard-card relative overflow-hidden group">
                    {/* Background Icon Watermark */}
                    <metric.icon className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-100 opacity-20 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-2.5 rounded-xl ${metric.bg} ${metric.color}`}>
                                <metric.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                                {metric.trend}
                            </span>
                        </div>

                        <div className="mt-auto">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                {metric.label}
                            </span>
                            <span className="text-3xl font-black text-gray-900 tracking-tighter">
                                {metric.value}
                            </span>
                            <span className="block text-xs font-bold text-gray-400 mt-1 uppercase tracking-tight">
                                {metric.sub}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InfoCardsGrid;
