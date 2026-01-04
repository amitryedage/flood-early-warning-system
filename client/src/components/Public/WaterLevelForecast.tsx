import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ForecastPoint {
    timestamp: number;
    waterLevel: number;
}

interface WaterLevelForecastProps {
    forecast?: ForecastPoint[];
    currentLevel?: number;
}

const WaterLevelForecast: React.FC<WaterLevelForecastProps> = ({ forecast, currentLevel }) => {
    if (!forecast || forecast.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-sky-500 w-5 h-5" /> Water Level Forecast
                </h3>
                <div className="h-48 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">Gathering prediction data...</p>
                </div>
            </div>
        );
    }

    const maxLevel = Math.max(...forecast.map(p => p.waterLevel), currentLevel || 0, 15);
    const minLevel = 10; // Base level for visualization

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="text-sky-500 w-5 h-5" /> Water Level Forecast
                    </h3>
                    <p className="text-xs text-slate-500">Next 8 hours projection</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-bold uppercase">AI Driven</span>
                </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-1.5 px-2 pt-10 pb-2 border-b border-l border-slate-100 bg-slate-50/50 rounded-bl-lg relative mb-4">
                {/* Danger line */}
                <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-red-100 border-t border-dashed border-red-300 z-0">
                    <span className="absolute -top-3.5 left-1 text-[8px] font-black text-red-500 uppercase tracking-tighter">Danger Zone (14.5m+)</span>
                </div>

                {forecast.slice(0, 8).map((point, i) => {
                    const height = Math.min(100, Math.max(10, ((point.waterLevel - minLevel) / (maxLevel - minLevel)) * 100));
                    const time = new Date(point.timestamp).getHours();

                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative z-10">
                            <div
                                className={`w-full rounded-t-lg transition-all duration-1000 ${point.waterLevel > 14.5 ? 'bg-gradient-to-t from-red-500 to-red-400' :
                                    point.waterLevel > 13.0 ? 'bg-gradient-to-t from-orange-500 to-orange-400' :
                                        'bg-gradient-to-t from-sky-500 to-sky-400'
                                    }`}
                                style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-[9px] text-slate-400 font-bold">{time}:00</span>

                            {/* Tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1.5 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap pointer-events-none z-20">
                                <div className="font-black text-sky-400">{point.waterLevel.toFixed(1)}m</div>
                                <div className="opacity-60">{time}:00</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-sky-50 border border-sky-100 p-3 rounded-xl flex items-start gap-3">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-sky-900">Analysis</h4>
                    <p className="text-[11px] text-sky-800 leading-tight mt-0.5">
                        {currentLevel && forecast[0].waterLevel > currentLevel
                            ? "Rising trend detected. Prepare for potential water increase in low-lying areas."
                            : "Stable or receding levels predicted for the next window."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WaterLevelForecast;
