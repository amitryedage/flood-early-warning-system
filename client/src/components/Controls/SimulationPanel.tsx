import React, { useState } from 'react';
import { Settings, Droplets, CloudRain, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface SimulationPanelProps {
    waterLevel: number;
    rainfall: number;
    status: string;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
    waterLevel: currentWaterLevel,
    rainfall: currentRainfall,
    status
}) => {
    const [localWaterLevel, setLocalWaterLevel] = useState(currentWaterLevel);
    const [localRainfall, setLocalRainfall] = useState(currentRainfall);
    const [isUpdating, setIsUpdating] = useState(false);
    const [lastSuccess, setLastSuccess] = useState(false);

    // Sync local state when props change (from remote updates)
    React.useEffect(() => {
        setLocalWaterLevel(currentWaterLevel);
        setLocalRainfall(currentRainfall);
    }, [currentWaterLevel, currentRainfall]);

    const updateSimulation = async (updates: { waterLevel?: number; rainfall?: number }) => {
        setIsUpdating(true);
        setLastSuccess(false);
        try {
            await axios.post('http://localhost:3000/api/simulate', updates);
            setLastSuccess(true);
            setTimeout(() => setLastSuccess(false), 2000);
        } catch (error) {
            console.error('Failed to update simulation:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Scenarios
    const setScenario = (type: 'NORMAL' | 'RAIN' | 'CRISIS') => {
        const scenarios = {
            'NORMAL': { waterLevel: 12.0, rainfall: 45 },
            'RAIN': { waterLevel: 13.5, rainfall: 120 },
            'CRISIS': { waterLevel: 15.2, rainfall: 250 }
        };
        const selected = scenarios[type];
        setLocalWaterLevel(selected.waterLevel);
        setLocalRainfall(selected.rainfall);
        updateSimulation(selected);
    };

    return (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xl w-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sky-600">
                    <Settings className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Simulation Control</h3>
                </div>
                {lastSuccess && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full animate-bounce">
                    <Check size={10} /> SYNCED
                </span>}
            </div>

            <div className="space-y-6">
                {/* Water Level Slider */}
                <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-2 font-semibold">
                        <span className="flex items-center gap-1"><Droplets size={12} className="text-blue-500" /> Target Water Level</span>
                        <span className="font-mono text-blue-600 text-sm">{localWaterLevel.toFixed(1)}m</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="20"
                        step="0.1"
                        value={localWaterLevel}
                        onChange={(e) => setLocalWaterLevel(parseFloat(e.target.value))}
                        onMouseUp={() => updateSimulation({ waterLevel: localWaterLevel })}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Rainfall Slider */}
                <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-2 font-semibold">
                        <span className="flex items-center gap-1"><CloudRain size={12} className="text-sky-500" /> Rainfall Intensity</span>
                        <span className="font-mono text-sky-600 text-sm">{localRainfall}mm/hr</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="300"
                        step="1"
                        value={localRainfall}
                        onChange={(e) => setLocalRainfall(parseFloat(e.target.value))}
                        onMouseUp={() => updateSimulation({ rainfall: localRainfall })}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                </div>

                {/* Scenario Presets */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                    <button
                        onClick={() => setScenario('NORMAL')}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
                    >
                        <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-500">RESET</span>
                    </button>
                    <button
                        onClick={() => setScenario('RAIN')}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                    >
                        <CloudRain className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-500">HEAVY</span>
                    </button>
                    <button
                        onClick={() => setScenario('CRISIS')}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg border border-red-100 hover:bg-red-50 transition-all group"
                    >
                        <AlertTriangle className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                        <span className="text-[10px] font-bold text-slate-500">CRISIS</span>
                    </button>
                </div>

                {/* Current Status Indicator */}
                <div className={`mt-4 text-center p-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] border shadow-sm transition-all duration-500 ${status === 'CRITICAL' ? 'bg-red-600 text-white border-red-700' :
                    status === 'WARNING' ? 'bg-orange-500 text-white border-orange-600' :
                        'bg-emerald-600 text-white border-emerald-700'
                    }`}>
                    System Status: {status}
                </div>
            </div>
        </div>
    );
};

export default SimulationPanel;
