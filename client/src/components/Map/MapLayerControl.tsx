import React, { useState } from 'react';
import { Layers, CloudRain, Shield, AlertTriangle, Users } from 'lucide-react';

export interface MapLayers {
    floodZones: boolean;
    shelters: boolean;
    teams: boolean;
    rainfall: boolean;
}

interface MapLayerControlProps {
    layers: MapLayers;
    onToggle: (layer: keyof MapLayers) => void;
}

const MapLayerControl: React.FC<MapLayerControlProps> = ({ layers, onToggle }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-50 transition-all active:scale-95"
            >
                <Layers className="w-5 h-5" />
            </button>

            <div className={`
                bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl transition-all duration-300 origin-bottom-left overflow-hidden
                ${isOpen ? 'w-48 opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-50 p-0 border-0'}
            `}>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Map Overlays</p>

                    <button
                        onClick={() => onToggle('floodZones')}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-all ${layers.floodZones ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <span className="flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> Zones
                        </span>
                        <div className={`w-2 h-2 rounded-full ${layers.floodZones ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    </button>

                    <button
                        onClick={() => onToggle('shelters')}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-all ${layers.shelters ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <span className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5" /> Shelters
                        </span>
                        <div className={`w-2 h-2 rounded-full ${layers.shelters ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                    </button>

                    <button
                        onClick={() => onToggle('teams')}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-all ${layers.teams ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <span className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5" /> Teams
                        </span>
                        <div className={`w-2 h-2 rounded-full ${layers.teams ? 'bg-orange-600' : 'bg-slate-300'}`} />
                    </button>

                    <button
                        onClick={() => onToggle('rainfall')}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-all ${layers.rainfall ? 'bg-cyan-50 text-cyan-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <span className="flex items-center gap-2">
                            <CloudRain className="w-3.5 h-3.5" /> Rainfall
                        </span>
                        <div className={`w-2 h-2 rounded-full ${layers.rainfall ? 'bg-cyan-600' : 'bg-slate-300'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapLayerControl;
