import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, MapPin, Phone, MessageSquare, Navigation, TrendingUp } from 'lucide-react';
import type { Village, Team } from '../../types/admin.types';

const RightPanelTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'villages' | 'teams' | 'predictions' | 'history'>('villages');

    // Mock Data
    const villages: Village[] = [
        { id: '1', name: 'Villupuram', riskLevel: 95, population: 45000, status: 'critical', lat: 11.94, lng: 79.48 },
        { id: '2', name: 'Kolhapur', riskLevel: 87, population: 32000, status: 'critical', lat: 16.70, lng: 74.24 },
        { id: '3', name: 'Nashik', riskLevel: 72, population: 15000, status: 'danger', lat: 19.99, lng: 73.78 },
        { id: '4', name: 'Belgaum', riskLevel: 45, population: 12000, status: 'warning', lat: 15.84, lng: 74.49 },
        { id: '5', name: 'Aurangabad', riskLevel: 28, population: 89000, status: 'safe', lat: 19.87, lng: 75.34 },
    ];

    const teams: Team[] = [
        { id: 't1', name: 'NDRF Team 1', type: 'NDRF', status: 'active', location: 'Nashik', members: 15 },
        { id: 't2', name: 'Fire Dept A', type: 'Fire', status: 'active', location: 'Kolhapur', members: 8 },
        { id: 't3', name: 'Rescue 2', type: 'Volunteer', status: 'en-route', location: 'Belgaum', members: 12 },
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
                            {villages.map(village => (
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
                            <span className="text-xs font-semibold text-slate-500 uppercase">Deployed Teams</span>
                            <span className="text-xs bg-slate-100 rounded px-2 py-0.5 text-slate-600">Total: {teams.length}</span>
                        </div>
                        {teams.map(team => (
                            <div key={team.id} className="p-3 border border-slate-100 rounded-lg hover:border-blue-200 transition-colors bg-white">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold text-slate-700 text-sm">{team.name}</h4>
                                        <p className="text-xs text-slate-500">{team.type} • {team.members} Members</p>
                                    </div>
                                    <span className={`w-2 h-2 rounded-full ${team.status === 'active' ? 'bg-emerald-500 animate-pulse' :
                                        team.status === 'en-route' ? 'bg-yellow-500' : 'bg-slate-400'
                                        }`}></span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {team.location}
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                    <button className="flex justify-center items-center py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors">
                                        <Phone className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="flex justify-center items-center py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="flex justify-center items-center py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 transition-colors">
                                        <Navigation className="w-3.5 h-3.5" />
                                    </button>
                                </div>
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

                        {/* CSS Bar Chart */}
                        <div className="h-48 flex items-end justify-between gap-2 px-2 pt-6 pb-2 border-b border-l border-slate-200 bg-slate-50 relative">
                            {/* Y-Axis Lines */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-slate-200 border-t border-dashed border-slate-300"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-200 border-t border-dashed border-slate-300"></div>

                            {[74, 78, 90, 89, 85].map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                    <div
                                        className={`w-full max-w-[30px] rounded-t-sm transition-all duration-500 ${val > 80 ? 'bg-red-400' : val > 60 ? 'bg-orange-400' : 'bg-blue-400'
                                            }`}
                                        style={{ height: `${val}%` }}
                                    ></div>
                                    <span className="text-[10px] text-slate-500 font-mono">{12 + i}:00</span>

                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        Level: {val}%
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h5 className="text-sm font-bold text-blue-800 mb-1">Prediction Analysis</h5>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        Water levels are expected to peak at <span className="font-bold">14:00</span> (90% capacity).
                                        Response teams should be deployed to Zone A by 13:30.
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
