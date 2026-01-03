import React from 'react';
import { Settings, Droplets, CloudRain } from 'lucide-react';

interface SimulationPanelProps {
    waterLevel: number;
    setWaterLevel: (val: number) => void;
    rainfall: number;
    setRainfall: (val: number) => void;
    status: string;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
    waterLevel, setWaterLevel, rainfall, setRainfall, status
}) => {
    return (
        <div className="absolute bottom-6 right-6 z-50 p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-2xl w-72">
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <Settings className="w-5 h-5 animate-spin-slow" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Simulation Control</h3>
            </div>

            <div className="space-y-6">
                {/* Water Level Slider */}
                <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1"><Droplets size={12} /> Water Level</span>
                        <span className="font-mono text-cyan-400">{waterLevel.toFixed(1)}m</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="20"
                        step="0.1"
                        value={waterLevel}
                        onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>

                {/* Rainfall Slider */}
                <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1"><CloudRain size={12} /> Rainfall Rate</span>
                        <span className="font-mono text-blue-400">{rainfall}mm/hr</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        step="1"
                        value={rainfall}
                        onChange={(e) => setRainfall(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Status Indicator (Read Only) */}
                <div className="pt-2 border-t border-slate-700">
                    <div className={`text-center p-2 rounded font-bold text-xs uppercase tracking-[0.2em] ${status === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border border-red-500/50' :
                            status === 'WARNING' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' :
                                'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50'
                        }`}>
                        Current Status: {status}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulationPanel;
