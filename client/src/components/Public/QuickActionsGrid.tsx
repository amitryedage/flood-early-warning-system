import React from 'react';
import { Map, Bell, Home, Users, Phone, Shield } from 'lucide-react';

const QuickActionsGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Evacuation Routes */}
            <button className="flex flex-col items-start p-5 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 hover:border-blue-200 hover:shadow-md transition-all group text-left">
                <div className="p-3 bg-blue-500 rounded-lg text-white mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    <Map className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-blue-900 text-lg mb-1">Evacuation Routes</h3>
                <p className="text-blue-700/80 text-sm mb-4">GPS-guided routes to safety.</p>
                <span className="mt-auto text-xs font-bold text-blue-600 bg-white/50 px-3 py-1.5 rounded-full">
                    → OPEN MAP
                </span>
            </button>

            {/* Alert Me */}
            <button className="flex flex-col items-start p-5 bg-orange-50 border border-orange-100 rounded-xl hover:bg-orange-100 hover:border-orange-200 hover:shadow-md transition-all group text-left">
                <div className="p-3 bg-orange-500 rounded-lg text-white mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    <Bell className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-orange-900 text-lg mb-1">Set Alerts</h3>
                <p className="text-orange-700/80 text-sm mb-4">Notify when water rises.</p>
                <span className="mt-auto text-xs font-bold text-orange-600 bg-white/50 px-3 py-1.5 rounded-full">
                    → CONFIGURE
                </span>
            </button>

            {/* Nearby Shelters */}
            <button className="flex flex-col items-start p-5 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 hover:border-emerald-200 hover:shadow-md transition-all group text-left">
                <div className="p-3 bg-emerald-500 rounded-lg text-white mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    <Home className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-emerald-900 text-lg mb-1">Nearby Shelters</h3>
                <p className="text-emerald-700/80 text-sm mb-4">Find safe locations nearby.</p>
                <span className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-600 bg-white/50 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    15 BEDS OPEN
                </span>
            </button>

            {/* Family Check-in */}
            <button className="flex flex-col items-start p-5 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 hover:border-purple-200 hover:shadow-md transition-all group text-left">
                <div className="p-3 bg-purple-500 rounded-lg text-white mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-purple-900 text-lg mb-1">Family Check-In</h3>
                <p className="text-purple-700/80 text-sm mb-4">Mark yourself safe.</p>
                <span className="mt-auto text-xs font-bold text-purple-600 bg-white/50 px-3 py-1.5 rounded-full">
                    → UPDATE STATUS
                </span>
            </button>

            {/* Emergency */}
            <button className="flex flex-col items-start p-5 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 hover:border-red-200 hover:shadow-md transition-all group text-left ring-2 ring-transparent hover:ring-red-200">
                <div className="p-3 bg-red-500 rounded-lg text-white mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-red-900 text-lg mb-1">Emergency 1078</h3>
                <p className="text-red-700/80 text-sm mb-4">Call Disaster Management.</p>
                <span className="mt-auto text-xs font-bold text-red-600 bg-white/50 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Phone className="w-3 h-3" /> CALL NOW
                </span>
            </button>

            {/* Local Admin */}
            <button className="flex flex-col items-start p-5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="p-3 bg-slate-700 rounded-lg text-white mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Local Admin</h3>
                <p className="text-slate-600 text-sm mb-4">Contact district officials.</p>
                <span className="mt-auto text-xs font-bold text-slate-600 bg-white/50 px-3 py-1.5 rounded-full">
                    → CONTACT
                </span>
            </button>
        </div>
    );
};

export default QuickActionsGrid;
