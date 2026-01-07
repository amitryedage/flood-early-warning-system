import React from 'react';
import { Compass, Activity, ChevronRight, Home } from 'lucide-react';

interface SafeRouteAIProps {
    onClose: () => void;
    activeVillage?: string;
}

const SafeRouteAI: React.FC<SafeRouteAIProps> = ({ onClose, activeVillage }) => {
    const defaultVillage = activeVillage || 'Sangli Basin';

    const shelters = [
        { name: 'St. Mary School', capacity: 85, status: 'OPEN', distance: '0.8km', supplies: ['Food', 'Beds', 'Meds'] },
        { name: 'Govt. Community Hall', capacity: 98, status: 'CRITICAL', distance: '1.2km', supplies: ['Meds'] },
        { name: 'Hilltop Plaza Center', capacity: 42, status: 'OPEN', distance: '1.5km', supplies: ['Food', 'Beds'] },
    ];

    return (
        <div className="fixed left-8 top-24 z-[100] w-[380px] animate-in slide-in-from-left duration-500">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-blue-100 ring-4 ring-blue-50/50">
                {/* Header Section */}
                <div className="bg-blue-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <Compass className="w-5 h-5 animate-spin-slow" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">SafeRoute AI v2.4</span>
                        </div>
                        <button onClick={onClose} className="p-1 px-3 bg-white/20 hover:bg-white/30 rounded-full text-[10px] font-bold transition-all uppercase tracking-tighter">
                            Hide Guidance
                        </button>
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter relative z-10">Evacuation Pathway</h2>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Sector Impact: {defaultVillage}</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Next Action */}
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md">1</div>
                            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Next Safe Action</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">Move North-East towards MG Road. Our sensors detect water levels below 0.2m on this corridor.</p>
                    </div>

                    {/* Path Risk Profile */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Path Hazard</p>
                            <div className="flex items-center justify-center gap-1">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                <span className="font-black text-sm text-emerald-700">LOW RISK</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Walk Time</p>
                            <span className="font-black text-sm">~12 MINS</span>
                        </div>
                    </div>

                    {/* Shelter Health Radar */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Home className="w-4 h-4" /> Shelter Availability
                            </h4>
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>

                        <div className="space-y-3">
                            {shelters.map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all group cursor-pointer shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-8 rounded-full ${s.status === 'CRITICAL' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 tracking-tight group-hover:text-blue-600">{s.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{s.distance} • {s.supplies.join(', ')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-black ${s.status === 'CRITICAL' ? 'text-red-600' : 'text-slate-900'}`}>{s.capacity}%</p>
                                        <p className="text-[8px] font-bold text-slate-400">FILLED</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center justify-center gap-2 transition-all font-black text-xs shadow-lg group">
                        REQUEST TRANSPORT <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">AI Pathing considers ISRO-RISAT Inundation Data</p>
                </div>
            </div>
        </div>
    );
};

export default SafeRouteAI;
