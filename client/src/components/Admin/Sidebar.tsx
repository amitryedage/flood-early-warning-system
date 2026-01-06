import React from 'react';
import { MapPin, AlertTriangle, Send, PlusCircle, Users, BarChart2, Settings, FileText, Activity } from 'lucide-react';

import { useToast } from '../../context/ToastContext';

const AdminSidebar: React.FC = () => {
    const { addToast } = useToast();

    return (
        <aside className="fixed top-[70px] left-0 bottom-0 w-[280px] bg-white border-r border-slate-200 overflow-y-auto z-40 flex flex-col shadow-xl font-sans text-slate-600">
            {/* Sector Control */}
            <div className="px-6 py-8 border-b border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-600" /> SECTOR SELECTION
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Target Basin</label>
                        <div className="relative group">
                            <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 appearance-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 block shadow-sm font-bold hover:bg-slate-100 transition-all cursor-pointer outline-none">
                                <option>Godavari River System</option>
                                <option>Krishna River Basin</option>
                                <option>Tapi Tactical Zone</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <MapPin className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Observation Window</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-cyan-600 text-white px-3 py-2 rounded-lg text-[10px] font-black hover:bg-cyan-700 active:scale-95 transition-all shadow-md shadow-cyan-500/20 uppercase">
                                24 Hours
                            </button>
                            <button className="bg-white text-slate-500 border border-slate-200 px-3 py-2 rounded-lg text-[10px] font-black hover:bg-slate-50 hover:text-slate-900 transition-all uppercase">
                                07 Days
                            </button>
                            <button className="bg-white text-slate-500 border border-slate-200 px-3 py-2 rounded-lg text-[10px] font-black hover:bg-slate-50 hover:text-slate-900 transition-all uppercase">
                                30 Days
                            </button>
                            <button className="bg-white text-slate-500 border border-slate-200 px-3 py-2 rounded-lg text-[10px] font-black hover:bg-slate-50 hover:text-slate-900 transition-all uppercase">
                                History
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Thresholds */}
            <div className="px-6 py-8 border-b border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> THRESHOLD PARAMETERS
                </h3>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest">Early Warning</span>
                            <span className="text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">60%</span>
                        </div>
                        <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-amber-500 w-[60%]"></div>
                            <input type="range" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10" value="60" readOnly />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] text-red-600 font-black uppercase tracking-widest">Critical Mass</span>
                            <span className="text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">82%</span>
                        </div>
                        <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-red-600 w-[82%]"></div>
                            <input type="range" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10" value="82" readOnly />
                        </div>
                    </div>

                    <button
                        onClick={() => addToast('success', 'Threshold configuration saved')}
                        className="w-full py-3 text-[10px] font-black text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:text-cyan-600 hover:border-cyan-500/30 uppercase tracking-[0.2em]"
                    >
                        Commit Configuration
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-blue-600" /> RAPID RESPONSE
                </h3>
                <div className="space-y-4">
                    <button
                        onClick={() => addToast('warning', 'EMERGENCY BROADCAST SENT TO 24,000 DEVICES')}
                        className="w-full flex items-center justify-between bg-slate-100 hover:bg-slate-50 text-slate-900 px-5 py-4 rounded-xl text-xs font-black transition-all shadow-lg shadow-slate-200 active:scale-[0.98] group relative overflow-hidden"
                    >
                        <span className="relative z-10 uppercase tracking-tighter">Broadcast Emergency Alert</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => addToast('info', 'Station setup wizard started')}
                            className="flex flex-col items-center gap-2 bg-white border border-slate-200 hover:border-cyan-400 p-4 rounded-xl transition-all group shadow-sm"
                        >
                            <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-cyan-500" />
                            <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-slate-700">New Station</span>
                        </button>
                        <button
                            onClick={() => addToast('info', 'Team deployment interface opened')}
                            className="flex flex-col items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 p-4 rounded-xl transition-all group shadow-sm"
                        >
                            <Users className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                            <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-slate-700">Deploy Team</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Switcher */}
            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex bg-slate-200 p-1 rounded-xl border border-slate-300 gap-1">
                    <button className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg bg-white text-cyan-600 shadow-sm border border-slate-200">
                        <BarChart2 className="w-4 h-4" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Data</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all">
                        <FileText className="w-4 h-4" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Logs</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all">
                        <Settings className="w-4 h-4" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Sys</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
