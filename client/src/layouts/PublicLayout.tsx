import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, MapPin, Bell } from 'lucide-react';

const PublicLayout: React.FC = () => {
    const [isSafe] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="font-bold text-lg tracking-tight text-slate-800">FloodWatch</h1>
                </div>
                <button className="p-2 bg-slate-100 rounded-full relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </header>

            {/* Hero Status */}
            <div className={`p-6 text-center transition-colors duration-500 ${isSafe ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg ${isSafe ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {isSafe ? <ShieldCheck size={48} /> : <ShieldAlert size={48} />}
                </div>
                <h2 className="text-2xl font-bold mb-1">{isSafe ? 'You are Safe' : 'Evacuate Immediately'}</h2>
                <p className="text-slate-500 text-sm">Location: <span className="font-medium text-slate-700">Sector 4, River Bank</span></p>
            </div>

            {/* Quick Actions */}
            <div className="px-4 mt-6">
                <h3 className="font-semibold text-slate-800 mb-3 px-1">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center active:scale-95 transition-transform">
                        <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <span className="block text-sm font-medium text-slate-700">Evac Routes</span>
                    </button>
                    <button className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center active:scale-95 transition-transform">
                        <ShieldAlert className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                        <span className="block text-sm font-medium text-slate-700">Report Issue</span>
                    </button>
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="px-4 mt-6">
                <h3 className="font-semibold text-slate-800 mb-3 px-1">Recent Alerts</h3>
                <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
                        <p className="font-semibold text-slate-800 text-sm">Water Level Rising</p>
                        <p className="text-xs text-slate-500 mt-1">2 hours ago • National Water Commission</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                        <p className="font-semibold text-slate-800 text-sm">Heavy Rain Forecast</p>
                        <p className="text-xs text-slate-500 mt-1">5 hours ago • Meteorological Dept</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicLayout;
