import React, { useState, useEffect } from 'react';
import { Bell, LogOut, User, Activity, CloudRain } from 'lucide-react';

const AdminNavbar: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 h-[70px] bg-white border-b border-slate-200 z-50 px-6 flex items-center justify-between shadow-sm">

            {/* Left: Brand Identity */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <CloudRain className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-black text-xl tracking-tighter text-slate-900 leading-none">
                        FLOOD<span className="text-blue-600">GUARD</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                            Godavari Basin
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">v2.4.0-RC</span>
                    </div>
                </div>
            </div>

            {/* Center: Live Telemetry Status */}
            <div className="hidden lg:flex items-center justify-center gap-12 flex-1">
                <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-200 group hover:border-cyan-500/50 transition-all cursor-crosshair">
                    <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Health</span>
                        <span className="text-xs font-bold text-emerald-600 leading-none">OPTIMAL CONFIG</span>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="font-mono text-2xl font-black tracking-[0.15em] text-slate-800">
                        {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Zulu Time Sync</span>
                </div>

                <div className="flex gap-6">
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stations</p>
                        <p className="text-sm font-black text-slate-900">42 <span className="text-emerald-500 text-[10px]">OK</span></p>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-200"></div>
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Level</p>
                        <p className="text-sm font-black text-orange-500 uppercase">Moderate</p>
                    </div>
                </div>
            </div>

            {/* Right: Operator Controls */}
            <div className="flex items-center justify-end gap-6 w-1/4">
                <button className="relative p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group overflow-hidden">
                    <Bell className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 relative z-10" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping z-10"></span>
                </button>

                <div className="flex items-center gap-3 pl-3 pr-5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Operator 01</p>
                        <p className="text-[9px] font-black text-cyan-600/70 uppercase tracking-widest leading-none mt-1 group-hover:text-cyan-600">Chief Admin</p>
                    </div>
                </div>

                <button className="p-2.5 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
