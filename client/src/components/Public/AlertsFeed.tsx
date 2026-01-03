import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const AlertsFeed: React.FC = () => {
    return (
        <div className="mb-8">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span>Recent Alerts</span>
                <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
            </h3>

            <div className="space-y-4">
                {/* Critical Alert */}
                {/* <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-red-700">Water Level Rising</h4>
                                <span className="text-xs text-slate-500">2 hours ago</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                Water level in Godavari River increased by 2.5m in last 6 hours. Currently at 72%. Expected to reach critical level by 14:00 today.
                            </p>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">⚠️ Monitoring</span>
                                <button className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1">Dismiss</button>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Warning Alert */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-orange-700">Heavy Rain Forecast</h4>
                                <span className="text-xs text-slate-500">5 hours ago</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                Heavy rainfall (60-80mm) expected in your area from 18:00 to 22:00 tonight. Please stay alert.
                            </p>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">🟡 Advisory</span>
                                <button className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1">Track Weather</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Safe Alert */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 shrink-0">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-emerald-700">Water Level Stable</h4>
                                <span className="text-xs text-slate-500">30 mins ago</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                Water level has stabilized at 45%. No immediate threat to your area. Continue monitoring.
                            </p>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">🟢 Safe</span>
                                <button className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1">Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertsFeed;
