import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, MapPin, Navigation, TrendingUp } from 'lucide-react';
import { useSocket, type FloodData } from '../../hooks/useSocket';

interface RightPanelTabsProps {
    floodData: FloodData | null;
}

const RightPanelTabs: React.FC<RightPanelTabsProps> = ({ floodData }) => {
    const { socket } = useSocket();
    const [activeTab, setActiveTab] = useState<'villages' | 'teams' | 'predictions' | 'history'>('villages');
    const [dispatchingTo, setDispatchingTo] = useState<string | null>(null);
    const [taskTitle, setTaskTitle] = useState('');

    // Live Data from socket
    const teams = floodData?.responders || [];
    const activeTasks = floodData?.tasks || [];

    const handleDispatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (socket && dispatchingTo && taskTitle) {
            socket.emit('dispatch-task', {
                title: taskTitle,
                type: 'EMERGENCY',
                urgency: 'HIGH',
                assignedTo: dispatchingTo
            });
            setDispatchingTo(null);
            setTaskTitle('');
        }
    };

    // Mock Data for villages (Static for now)
    const villagesList = [
        { id: '1', name: 'Villupuram', riskLevel: 95, population: 45000, status: 'critical', lat: 11.94, lng: 79.48 },
        { id: '2', name: 'Kolhapur', riskLevel: 87, population: 32000, status: 'critical', lat: 16.70, lng: 74.24 },
        { id: '3', name: 'Nashik', riskLevel: 72, population: 15000, status: 'danger', lat: 19.99, lng: 73.78 },
        { id: '4', name: 'Belgaum', riskLevel: 45, population: 12000, status: 'warning', lat: 15.84, lng: 74.49 },
        { id: '5', name: 'Aurangabad', riskLevel: 28, population: 89000, status: 'safe', lat: 19.87, lng: 75.34 },
    ];

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center border-b border-slate-100">
                <button
                    onClick={() => setActiveTab('villages')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${activeTab === 'villages' ? 'border-sky-600 text-sky-600 bg-sky-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    Villages
                </button>
                <button
                    onClick={() => setActiveTab('teams')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${activeTab === 'teams' ? 'border-sky-600 text-sky-600 bg-sky-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    Teams
                </button>
                <button
                    onClick={() => setActiveTab('predictions')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${activeTab === 'predictions' ? 'border-sky-600 text-sky-600 bg-sky-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    Predict
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${activeTab === 'history' ? 'border-sky-600 text-sky-600 bg-sky-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    History
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

                {/* VILLAGES TAB */}
                {activeTab === 'villages' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search villages..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                />
                            </div>
                            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {villagesList.map(village => (
                                <div key={village.id} className="group p-3 border border-slate-100 rounded-lg hover:border-sky-200 hover:shadow-sm transition-all bg-white cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-slate-700">{village.name}</h4>
                                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${village.status === 'critical' ? 'bg-red-100 text-red-600' :
                                            village.status === 'danger' ? 'bg-orange-100 text-orange-600' :
                                                village.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-emerald-100 text-emerald-600'
                                            }`}>
                                            {village.riskLevel}% Risk
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Pop: {village.population.toLocaleString()}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 hover:bg-slate-100 rounded">
                                                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                                            </button>
                                            <button className="p-1 hover:bg-slate-100 rounded">
                                                <MoreHorizontal className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${village.status === 'critical' ? 'bg-red-500' :
                                                village.status === 'danger' ? 'bg-orange-500' :
                                                    village.status === 'warning' ? 'bg-yellow-500' :
                                                        'bg-emerald-500'
                                                }`}
                                            style={{ width: `${village.riskLevel}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TEAMS TAB */}
                {activeTab === 'teams' && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase">Live Field Units</span>
                            <span className="text-xs bg-slate-100 rounded px-2 py-0.5 text-slate-600">Total: {teams.length}</span>
                        </div>
                        {teams.map(team => (
                            <div key={team.id} className={`p-3 border rounded-lg transition-all bg-white ${dispatchingTo === team.id ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-100'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold text-slate-700 text-sm">{team.name}</h4>
                                        <p className="text-xs text-slate-500">RES-UNIT • {team.status}</p>
                                    </div>
                                    <span className={`w-2.5 h-2.5 rounded-full ${team.status === 'ON_DUTY' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-400'}`}></span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded mb-3">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {team.lat.toFixed(4)}, {team.lng.toFixed(4)}
                                </div>

                                {/* Active Task for this team */}
                                {activeTasks.find(t => t.assignedTo === team.id && t.status !== 'COMPLETED') ? (
                                    <div className="bg-orange-50 border border-orange-100 p-2 rounded mb-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-orange-600 uppercase">Active Task</span>
                                            <span className="text-[10px] bg-orange-200 text-orange-700 px-1 rounded font-black">{activeTasks.find(t => t.assignedTo === team.id)?.status}</span>
                                        </div>
                                        <p className="text-xs font-bold text-orange-800 mt-1">{activeTasks.find(t => t.assignedTo === team.id)?.title}</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDispatchingTo(dispatchingTo === team.id ? null : team.id)}
                                        className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold text-xs flex items-center justify-center gap-2 mb-3"
                                    >
                                        <Navigation className="w-3 h-3" /> DISPATCH ORDER
                                    </button>
                                )}

                                {dispatchingTo === team.id && (
                                    <form onSubmit={handleDispatch} className="mt-2 pt-3 border-t border-slate-100 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Task details (e.g. Evacuate 4B)"
                                            className="w-full px-2 py-2 text-xs border border-slate-200 rounded outline-none focus:ring-2 focus:ring-sky-500"
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit" className="flex-1 py-1.5 bg-slate-900 text-white rounded text-[10px] font-bold">SEND COMMAND</button>
                                            <button type="button" onClick={() => setDispatchingTo(null)} className="px-3 py-1.5 bg-slate-100 rounded text-[10px] font-bold">CANCEL</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* PREDICTIONS TAB */}
                {activeTab === 'predictions' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-700">Water Level Forecast</h4>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Next 5 Hours</span>
                        </div>

                        {/* CSS Bar Chart - Dynamic */}
                        <div className="h-48 flex items-end justify-between gap-2 px-2 pt-10 pb-2 border-b border-l border-slate-200 bg-slate-50 relative">
                            {/* Capacity Markers */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-200 border-t border-dashed border-red-300 z-0">
                                <span className="absolute -top-3 left-1 text-[8px] font-black text-red-500 uppercase">Danger (15m+)</span>
                            </div>
                            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-200 border-t border-dashed border-slate-300 z-0"></div>

                            {floodData?.forecast.slice(0, 8).map((point, i) => {
                                // Normalize height (10m = 0%, 20m = 100%)
                                const height = Math.min(100, Math.max(10, (point.waterLevel - 10) * 10));
                                const time = new Date(point.timestamp).getHours();

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative z-10">
                                        <div
                                            className={`w-full max-w-[24px] rounded-t-lg transition-all duration-1000 ${point.waterLevel > 14.5 ? 'bg-gradient-to-t from-red-600 to-red-400' :
                                                point.waterLevel > 13.0 ? 'bg-gradient-to-t from-orange-600 to-orange-400' :
                                                    'bg-gradient-to-t from-blue-600 to-blue-400'
                                                }`}
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        <span className="text-[10px] text-slate-500 font-black">{time}:00</span>

                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[10px] px-2 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap pointer-events-none">
                                            <div className="font-black text-sky-400 mb-0.5">{point.waterLevel.toFixed(1)}m</div>
                                            <div className="opacity-60">{time}:00 HRS</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h5 className="text-sm font-bold text-blue-800 mb-1">AI Prediction Report</h5>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        {floodData && floodData.forecast && floodData.forecast.length > 0 ? (
                                            floodData.forecast[0].waterLevel > floodData.waterLevel ? (
                                                <>Water levels are <span className="font-black text-red-600">RISING</span>. Peak surge expected at <span className="font-bold">{new Date(floodData.forecast.reduce((prev, current) => (prev.waterLevel > current.waterLevel) ? prev : current).timestamp).getHours()}:00</span>.</>
                                            ) : (
                                                <>Water levels are <span className="font-black text-emerald-600">STABILIZING</span>. No immediate surge detected in next 24h.</>
                                            )
                                        ) : (
                                            "Calculating real-time projections..."
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase">Alert Timeline</span>
                            <span className="text-xs bg-slate-100 rounded px-2 py-0.5 text-slate-600">Today</span>
                        </div>

                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pl-6 pb-2">
                            {[
                                { time: '14:30', title: 'Critical Alert Sent', desc: 'Evacuation order for Zone A', type: 'critical' },
                                { time: '13:15', title: 'Water Level Rise', desc: 'Godavari crossed 14m mark', type: 'warning' },
                                { time: '12:00', title: 'Team Deployed', desc: 'NDRF Team 1 reached Nashik', type: 'info' },
                                { time: '10:45', title: 'System Check', desc: 'All sensors operational', type: 'success' },
                            ].map((item, i) => (
                                <div key={i} className="relative">
                                    {/* Dot */}
                                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.type === 'critical' ? 'bg-red-500' :
                                        item.type === 'warning' ? 'bg-orange-500' :
                                            item.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
                                        }`}></div>

                                    <div className="flex justify-between items-start">
                                        <h5 className="text-sm font-bold text-slate-700">{item.title}</h5>
                                        <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RightPanelTabs;
