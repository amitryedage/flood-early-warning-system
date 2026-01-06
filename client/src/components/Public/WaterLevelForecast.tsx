import React from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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

            <div className="h-64 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={forecast.slice(0, 8).map(p => ({
                            time: new Date(p.timestamp).getHours() + ':00',
                            level: p.waterLevel,
                            fullDate: new Date(p.timestamp).toLocaleString()
                        }))}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLevelCritical" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                            dy={10}
                        />
                        <YAxis
                            domain={[10, 'auto']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '12px' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}
                            formatter={(value: number) => [`${value.toFixed(1)} Meters`, 'Water Level']}
                        />
                        <Area
                            type="monotone"
                            dataKey="level"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorLevel)"
                            animationDuration={1500}
                        />
                        {/* Reference Line for Critical Level */}
                        <ReferenceLine y={14.5} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'DANGER', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                    </AreaChart>
                </ResponsiveContainer>
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
