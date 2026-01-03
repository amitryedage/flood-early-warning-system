import React, { useState, useEffect } from 'react';
import { Bell, Settings, LogOut, User } from 'lucide-react';

const AdminNavbar: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 h-[70px] bg-sky-950 border-b border-sky-900/50 shadow-lg z-50 flex items-center justify-between px-6 text-slate-100">
            {/* Left: Brand */}
            <div className="flex items-center gap-4 w-1/5">
                <div className="text-4xl">🌊</div>
                <div>
                    <h1 className="font-bold text-lg leading-tight tracking-wide">FLOOD WARNING</h1>
                    <p className="text-xs text-sky-400 font-mono tracking-wider">SYSTEM ADMIN V2.0</p>
                </div>
            </div>

            {/* Center: Status & Clock */}
            <div className="flex items-center justify-center gap-8 w-1/2">
                <div className="flex items-center gap-2 bg-sky-900/30 px-4 py-2 rounded-lg border border-sky-800/30">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    <span className="text-sm font-medium text-emerald-400">SYSTEM ACTIVE</span>
                </div>

                <div className="font-mono text-xl tracking-widest text-slate-300">
                    {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                </div>

                <div className="flex gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><span className="text-sky-400 font-bold">3</span> Rivers</span>
                    <span className="flex items-center gap-1"><span className="text-sky-400 font-bold">147</span> Villages</span>
                    <span className="flex items-center gap-1"><span className="text-orange-400 font-bold">8</span> At Risk</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-4 w-1/3">
                <button className="relative p-2 hover:bg-sky-800/50 rounded-full transition-colors group">
                    <Bell className="w-5 h-5 text-slate-300 group-hover:text-white" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="h-8 w-[1px] bg-sky-800/50 mx-2"></div>

                <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-sky-900/30 transition-colors cursor-pointer border border-transparent hover:border-sky-800/30">
                    <div className="w-8 h-8 rounded-full bg-sky-800 flex items-center justify-center text-sky-200">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-slate-200">Admin</p>
                        <p className="text-[10px] text-slate-400">War Room Dir.</p>
                    </div>
                </div>

                <button className="p-2 hover:bg-sky-800/50 rounded-full transition-colors text-slate-400 hover:text-white">
                    <Settings className="w-5 h-5" />
                </button>

                <button className="p-2 hover:bg-red-900/30 rounded-full transition-colors text-slate-400 hover:text-red-400">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
