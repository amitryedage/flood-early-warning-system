import React from 'react';

interface ThreatGaugeProps {
    waterLevel?: number;
    riskLevel?: number; // 0-100
}

const ThreatGauge: React.FC<ThreatGaugeProps> = ({ waterLevel = 0, riskLevel }) => {
    // Normalize water level to 0-100 range (assuming 12m is max)
    // If riskLevel is provided (from village), use it directly as the priority
    const percentage = riskLevel !== undefined ? riskLevel : Math.min((waterLevel / 12) * 100, 100);

    const zones = [
        { label: 'Safe', max: 25, color: 'bg-emerald-500', text: 'text-emerald-500' },
        { label: 'Low Risk', max: 50, color: 'bg-lime-500', text: 'text-lime-500' },
        { label: 'Warning', max: 75, color: 'bg-amber-500', text: 'text-amber-500' },
        { label: 'Danger', max: 100, color: 'bg-red-600', text: 'text-red-600' }
    ];

    const currentZone = zones.find(z => percentage <= z.max) || zones[3];

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <span className="block text-4xl font-black text-gray-900 leading-none mb-1">
                        {percentage.toFixed(0)}%
                    </span>
                    <span className={`text-xs font-black uppercase tracking-widest ${currentZone.text}`}>
                        {currentZone.label}
                    </span>
                </div>
                <div className="text-right">
                    <span className="block text-xl font-bold text-gray-400 tabular-nums">
                        {waterLevel.toFixed(1)}m
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        Current Level
                    </span>
                </div>
            </div>

            {/* Segmented Bar */}
            <div className="relative pt-2">
                <div className="flex h-4 gap-1.5 overflow-hidden">
                    {zones.map((zone, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-sm transition-colors duration-500 ${percentage > (i * 25) ? zone.color : 'bg-gray-100'}`}
                        />
                    ))}
                </div>

                {/* Indicator Arrow */}
                <div
                    className="absolute top-0 transition-all duration-1000 ease-out"
                    style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
                >
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-900"></div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-1 pt-2">
                {zones.map((zone, i) => (
                    <div key={i} className="text-center">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                            {zone.max}%
                        </span>
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-400 font-medium leading-relaxed italic border-t border-gray-50 pt-4">
                * Percentages based on seasonal maximum flood levels for your current geolocation sector.
            </p>
        </div>
    );
};

export default ThreatGauge;
