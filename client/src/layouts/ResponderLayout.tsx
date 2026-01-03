import React from 'react';
import { ClipboardList, Map, Navigation, CheckCircle } from 'lucide-react';

const ResponderLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-mono">
            {/* Field App Header */}
            <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-50">
                <div>
                    <h1 className="text-lg font-bold text-yellow-400">UNIT-ALPHA</h1>
                    <p className="text-xs text-slate-400">STATUS: ON DUTY</p>
                </div>
                <div className="bg-slate-700 px-3 py-1 rounded text-xs font-bold text-emerald-400">
                    CONN: OK
                </div>
            </header>

            {/* Critical Tasks */}
            <main className="p-4">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-slate-300">Priortiy Tasks</h2>
                    <span className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded font-bold">2 PENDING</span>
                </div>

                <div className="space-y-4">
                    {/* Task Card 1 */}
                    <div className="bg-slate-800 rounded-lg p-5 border-l-4 border-red-500 shadow-lg">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg">Evacuate Sector 4B</h3>
                            <Navigation className="text-slate-500" />
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded mb-4 text-sm text-slate-400">
                            <p>Flood risk imminent. 45 Families.</p>
                            <p className="mt-1 text-slate-500">Last updated: 10m ago</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold text-sm flex items-center justify-center gap-2">
                                <Map size={16} /> ROUTE
                            </button>
                            <button className="bg-emerald-600 hover:bg-emerald-500 py-3 rounded font-bold text-sm flex items-center justify-center gap-2">
                                <CheckCircle size={16} /> COMPLETE
                            </button>
                        </div>
                    </div>

                    {/* Task Card 2 */}
                    <div className="bg-slate-800 rounded-lg p-5 border-l-4 border-orange-500 shadow-lg opacity-80">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg">Check Levee Integrity</h3>
                            <ClipboardList className="text-slate-500" />
                        </div>
                        <p className="text-sm text-slate-400 mb-4">Report visual cracks at Point Delta.</p>
                        <button className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded font-bold text-sm">
                            VIEW DETAILS
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResponderLayout;
