import React from 'react';
import { CloudRain, TrendingUp, RefreshCw, Thermometer, Wind, Droplets } from 'lucide-react';

interface WeatherData {
    temperature: number | null;
    humidity: number | null;
    windSpeed: number | null;
    condition: string | null;
    description: string | null;
    icon: string | null;
    pressure: number | null;
    visibility: number | null;
    cloudiness: number | null;
    location: string | null;
}

interface InfoCardsGridProps {
    rainfall?: number;
    weather?: WeatherData;
    status?: 'NORMAL' | 'WARNING' | 'CRITICAL';
    timestamp?: number;
}

const InfoCardsGrid: React.FC<InfoCardsGridProps> = ({ rainfall, weather, status, timestamp }) => {
    // Format timestamp
    const getTimeSince = (ts?: number) => {
        if (!ts) return 'Waiting for data...';
        const seconds = Math.floor((Date.now() - ts) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
            {/* Card 1 - Temperature */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Thermometer className="w-3.5 h-3.5" /> Temperature
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">
                    {weather?.temperature !== null && weather?.temperature !== undefined
                        ? `${weather.temperature.toFixed(1)}°C`
                        : '--'}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                    {weather?.condition || 'Loading...'}
                </div>
            </div>

            {/* Card 2 - Rainfall */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <CloudRain className="w-3.5 h-3.5" /> Rainfall
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">
                    {rainfall !== undefined ? `${rainfall.toFixed(1)} mm` : '--'}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                    {rainfall !== undefined && rainfall > 50 ? 'Heavy' : rainfall !== undefined && rainfall > 20 ? 'Moderate' : 'Light'}
                </div>
            </div>

            {/* Card 3 - Humidity */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Droplets className="w-3.5 h-3.5" /> Humidity
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">
                    {weather?.humidity !== null && weather?.humidity !== undefined
                        ? `${weather.humidity}%`
                        : '--'}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Relative</div>
            </div>

            {/* Card 4 - Wind Speed */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Wind className="w-3.5 h-3.5" /> Wind Speed
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">
                    {weather?.windSpeed !== null && weather?.windSpeed !== undefined
                        ? `${weather.windSpeed.toFixed(1)} m/s`
                        : '--'}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Current</div>
            </div>

            {/* Card 5 - Status */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" /> Status
                </div>
                <div className={`text-xl md:text-2xl font-bold ${status === 'CRITICAL' ? 'text-red-600' :
                    status === 'WARNING' ? 'text-orange-600' :
                        'text-emerald-600'
                    }`}>
                    {status || 'NORMAL'}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Current Level</div>
            </div>

            {/* Card 6 - Last Update */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <RefreshCw className="w-3.5 h-3.5" /> Last Update
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-800">
                    {getTimeSince(timestamp)}
                </div>
                <div className="text-xs text-blue-600 font-medium mt-1 animate-pulse">Live Monitoring</div>
            </div>
        </div>
    );
};

export default InfoCardsGrid;
