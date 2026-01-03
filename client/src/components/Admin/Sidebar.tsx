import React from 'react';
import { MapPin, AlertTriangle, Send, PlusCircle, Users, BarChart2, Settings, FileText } from 'lucide-react';

const AdminSidebar: React.FC = () => {
    return (
        <aside className="fixed top-[70px] left-0 bottom-0 w-[280px] bg-white border-r border-slate-200 overflow-y-auto z-40 flex flex-col shadow-xl font-sans text-slate-600">
            {/* Filter Section */}
            <div className="px-6 py-8 border-b border-slate-200">
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-sky-500" /> Area & Time
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Selected River</label>
                        <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5 focus:ring-sky-500 focus:border-sky-500 block shadow-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer">
                            <option>Godavari River</option>
                            <option>Krishna River</option>
                            <option>Tapi River</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Time Period</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-sky-50 text-sky-700 border border-sky-200 px-3 py-2 rounded-md text-xs font-bold hover:bg-sky-100 active:bg-sky-200 transition-colors shadow-sm">
                                24 Hours
                            </button>
                            <button className="bg-white text-slate-600 border border-slate-200 px-3 py-2 rounded-md text-xs font-medium hover:bg-slate-50 transition-colors">
                                7 Days
                            </button>
                            <button className="bg-white text-slate-600 border border-slate-200 px-3 py-2 rounded-md text-xs font-medium hover:bg-slate-50 transition-colors">
                                30 Days
                            </button>
                            <button className="bg-white text-slate-600 border border-slate-200 px-3 py-2 rounded-md text-xs font-medium hover:bg-slate-50 transition-colors">
                                Custom
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Threshold Controls */}
            <div className="px-6 py-8 border-b border-slate-200">
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-orange-500" /> Alert Thresholds
                </h3>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-orange-700 font-bold uppercase">Warning Level</span>
                            <span className="text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded">60%</span>
                        </div>
                        <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" value="60" readOnly />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-red-700 font-bold uppercase">Danger Level</span>
                            <span className="text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded">80%</span>
                        </div>
                        <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" value="80" readOnly />
                    </div>

                    <button className="w-full py-2.5 text-xs font-semibold text-slate-500 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors hover:text-slate-700 hover:border-slate-400 flex items-center justify-center gap-2">
                        Save Configuration
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-8 border-b border-slate-200">
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Send className="w-3 h-3 text-blue-500" /> Quick Actions
                </h3>
                <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98] group">
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        Broadcast Alert
                    </button>
                    <button className="w-full flex items-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-lg text-sm font-semibold transition-colors hover:border-slate-400">
                        <PlusCircle className="w-4 h-4 text-slate-500" /> Add Station
                    </button>
                    <button className="w-full flex items-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-lg text-sm font-semibold transition-colors hover:border-slate-400">
                        <Users className="w-4 h-4 text-slate-500" /> Manage Teams
                    </button>
                </div>
            </div>

            {/* Footer Links */}
            <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <button className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-500 hover:text-blue-600 transition-colors p-2 rounded hover:bg-white hover:shadow-sm">
                        <BarChart2 className="w-4 h-4" /> Analytics
                    </button>
                    <button className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-500 hover:text-blue-600 transition-colors p-2 rounded hover:bg-white hover:shadow-sm">
                        <FileText className="w-4 h-4" /> Reports
                    </button>
                    <button className="flex flex-col items-center gap-1.5 text-[10px] font-medium text-slate-500 hover:text-blue-600 transition-colors p-2 rounded hover:bg-white hover:shadow-sm">
                        <Settings className="w-4 h-4" /> Settings
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
