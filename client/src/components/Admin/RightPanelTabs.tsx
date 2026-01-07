import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, MapPin, Navigation, TrendingUp, Activity, Terminal, Shield, Users, Satellite, Cloud, Info, Zap } from 'lucide-react';
import { useSatelliteData } from '../../hooks/useSatelliteData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useSocket, type FloodData } from '../../hooks/useSocket';

interface RightPanelTabsProps {
    floodData: FloodData | null;
    activeTab?: 'villages' | 'teams' | 'predictions' | 'history' | 'satellite';
    onTabChange?: (tab: 'villages' | 'teams' | 'predictions' | 'history' | 'satellite') => void;
}

const RightPanelTabs: React.FC<RightPanelTabsProps> = ({ floodData, activeTab: propsActiveTab, onTabChange }) => {
    const { socket } = useSocket();
    const [internalActiveTab, setInternalActiveTab] = useState<'villages' | 'teams' | 'predictions' | 'history' | 'satellite'>('villages');

    const activeTab = propsActiveTab || internalActiveTab;
    const setActiveTab = (tab: 'villages' | 'teams' | 'predictions' | 'history' | 'satellite') => {
        if (onTabChange) {
            onTabChange(tab);
        } else {
            setInternalActiveTab(tab);
        }
    };
    const [dispatchingTo, setDispatchingTo] = useState<string | null>(null);
    const [taskTitle, setTaskTitle] = useState('');

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

    const villagesList = floodData?.villages || [];

    const tabConfigs = [
        { id: 'villages', label: 'Zones', icon: Shield },
        { id: 'teams', label: 'Assets', icon: Navigation },
        { id: 'predictions', label: 'Intel', icon: Activity },
        { id: 'satellite', label: 'Sat', icon: Satellite },
        { id: 'history', label: 'Logs', icon: Terminal },
    ] as const;

    const { data: satData, loading: satLoading } = useSatelliteData({
        lat: 16.8524,
        lng: 74.5815,
        enabled: activeTab === 'satellite'
    });

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Tactical Tab Navigation */}
            <div className="flex items-center bg-slate-50 border-b border-slate-200 p-1">
                {tabConfigs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex flex-col items-center gap-1.5 py-4 transition-all relative ${activeTab === tab.id ? 'text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-600 shadow-sm rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">

                {/* ZONES TAB */}
                {activeTab === 'villages' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search sectors..."
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none placeholder:text-slate-400 transition-all"
                                />
                            </div>
                            <button className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500 transition-all">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {villagesList.map(village => (
                                <div key={village.id} className="group p-4 bg-white border border-slate-100 shadow-sm hover:shadow-md rounded-2xl hover:border-cyan-500/30 transition-all cursor-pointer relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${village.status === 'CRITICAL' ? 'bg-red-500' : village.status === 'WARNING' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{village.name}</h4>
                                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${village.status === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-200' :
                                            village.status === 'WARNING' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                'bg-emerald-50 text-emerald-600 border-emerald-200'
                                            }`}>
                                            {village.riskLevel}% LIKELIHOOD
                                        </span>
                                        {village.satelliteVerified && (
                                            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded shadow-lg animate-in zoom-in">
                                                <Satellite className="w-2.5 h-2.5" /> VERIFIED
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                        <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {village.population.toLocaleString()} EXPOSED</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                                            <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                        <div
                                            className={`h-full transition-all duration-1000 ${village.status === 'CRITICAL' ? 'bg-red-500' :
                                                village.status === 'WARNING' ? 'bg-orange-500' :
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

                {/* ASSETS TAB */}
                {activeTab === 'teams' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Response Units</span>
                            <span className="text-[10px] font-black text-cyan-600">SYNCED: {teams.length}</span>
                        </div>
                        {teams.map(team => (
                            <div key={team.id} className={`p-5 bg-white border-2 rounded-2xl transition-all shadow-sm ${dispatchingTo === team.id ? 'border-cyan-500 shadow-cyan-100' : 'border-slate-100'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-cyan-500/50">
                                            <Navigation className={`w-5 h-5 ${team.status === 'ON_DUTY' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{team.name}</h4>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{team.status}</p>
                                        </div>
                                    </div>
                                    <div className={`w-2.5 h-2.5 rounded-full ${team.status === 'ON_DUTY' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                </div>

                                <div className="text-[10px] font-mono text-cyan-600 bg-cyan-50/50 p-3 rounded-xl border border-cyan-100 mb-4 flex items-center gap-3">
                                    <MapPin className="w-3.5 h-3.5" />
                                    COORD: {team.lat.toFixed(4)}N / {team.lng.toFixed(4)}E
                                </div>

                                {activeTasks.find(t => t.assignedTo === team.id && t.status !== 'COMPLETED') ? (
                                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-10"><Activity className="w-8 h-8 text-orange-500" /></div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Current Mission</span>
                                            <span className="text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded-lg font-black uppercase">{activeTasks.find(t => t.assignedTo === team.id)?.status}</span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{activeTasks.find(t => t.assignedTo === team.id)?.title}</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDispatchingTo(dispatchingTo === team.id ? null : team.id)}
                                        className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <Terminal className="w-3.5 h-3.5" /> Issue Command
                                    </button>
                                )}

                                {dispatchingTo === team.id && (
                                    <form onSubmit={handleDispatch} className="mt-4 pt-5 border-t border-slate-100 space-y-3 animate-in slide-in-from-top-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="ENTER TACTICAL ORDER..."
                                            className="w-full bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 tracking-wider"
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                        />
                                        <div className="flex gap-3">
                                            <button type="submit" className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">Execute</button>
                                            <button type="button" onClick={() => setDispatchingTo(null)} className="px-5 py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Abort</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* INTEL TAB */}
                {activeTab === 'predictions' && (
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-cyan-600" /> Depth Projection Layer
                                </h4>
                                <span className="text-[10px] font-black bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full border border-cyan-200 uppercase tracking-widest">T+8 HRS</span>
                            </div>

                            {/* Tactical Bar Chart */}
                            <div className="h-64 w-full border-b border-l border-slate-200 bg-slate-50 relative rounded-bl-2xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={floodData?.forecast.slice(0, 8).map(p => ({
                                            time: new Date(p.timestamp).getHours() + ':00',
                                            level: p.waterLevel
                                        })) || []}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorLevelAdmin" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} dy={10} />
                                        <YAxis domain={[10, 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                                            labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                            itemStyle={{ color: '#22d3ee', fontSize: '12px', fontWeight: 'bold' }}
                                            formatter={(value: any) => [`${Number(value).toFixed(1)} M`, 'DEPTH']}
                                        />
                                        <ReferenceLine y={14.5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'CRITICAL', fill: '#ef4444', fontSize: 10, fontWeight: 'bold', position: 'right' }} />
                                        <Area type="monotone" dataKey="level" stroke="#0891b2" strokeWidth={3} fillOpacity={1} fill="url(#colorLevelAdmin)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="p-5 bg-cyan-50 border border-cyan-200 rounded-2xl relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform"><Shield className="w-24 h-24 text-cyan-600" /></div>
                            <div className="relative z-10 flex items-start gap-4">
                                <Activity className="w-6 h-6 text-cyan-600 mt-1 animate-pulse" />
                                <div>
                                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-2">Predictive Signal Analysis</h5>
                                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                                        {floodData && floodData.forecast && floodData.forecast.length > 0 ? (
                                            floodData.forecast[0].waterLevel > floodData.waterLevel ? (
                                                <>Signal indicates <span className="text-red-600 font-extrabold">ACCELERATED SURGE</span>. Estimated saturation at <span className="text-slate-900">{new Date(floodData.forecast.reduce((prev, current) => (prev.waterLevel > current.waterLevel) ? prev : current).timestamp).getHours()}:00</span>.</>
                                            ) : (
                                                <>Signal indicates <span className="text-emerald-600 font-extrabold">STABILIZATION</span>. Baseline levels holding for next observation cycle.</>
                                            )
                                        ) : (
                                            "Awaiting incoming telemetry packets..."
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* LOGS TAB */}
                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operations Timeline</span>
                            <span className="text-[10px] font-black text-cyan-600 uppercase">Sector Live</span>
                        </div>

                        <div className="relative border-l border-slate-200 ml-4 space-y-8 pl-8 pb-4">
                            {[
                                { time: '14:30', title: 'EXECUTE: ALERT_SENT', desc: 'Evacuation command broadcasted to Zone Delta', type: 'critical' },
                                { time: '13:15', title: 'TELEMETRY: LEVEL_CROSS', desc: 'Threshold 14M breached in Sector 4', type: 'warning' },
                                { time: '12:00', title: 'ASSET: UNIT_DEPOY', desc: 'Rescue Unit Alpha reached Nashville point', type: 'info' },
                                { time: '10:45', title: 'SYSTEM: BATT_PARAM', desc: 'All downstream sensors reporting green', type: 'success' },
                            ].map((item, i) => (
                                <div key={i} className="relative">
                                    {/* Tactical Node */}
                                    <div className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full border border-white shadow-lg z-20 ${item.type === 'critical' ? 'bg-red-500 shadow-red-200' :
                                        item.type === 'warning' ? 'bg-orange-500 shadow-orange-200' :
                                            item.type === 'info' ? 'bg-cyan-500 shadow-cyan-200' : 'bg-emerald-500'
                                        }`}></div>

                                    <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-inherit animate-ping opacity-20"></div>

                                    <div className="flex justify-between items-start mb-1">
                                        <h5 className={`text-[11px] font-black tracking-widest uppercase ${item.type === 'critical' ? 'text-red-500' :
                                            item.type === 'warning' ? 'text-orange-500' :
                                                'text-slate-700'
                                            }`}>{item.title}</h5>
                                        <span className="text-[9px] text-slate-400 font-black font-mono tracking-widest uppercase">{item.time} Z</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SATELLITE TAB */}
                {activeTab === 'satellite' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Planetary Intel: {(satData?.imagery as any)?.sensorType || 'Sentinel-2'}</span>
                            <span className={`text-[10px] font-black uppercase ${satLoading ? 'text-indigo-600 animate-pulse' : 'text-indigo-600'}`}>
                                {satLoading ? 'SCANNING ORBIT...' : 'SYNCED'}
                            </span>
                        </div>

                        {satLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acquiring Multi-Spectral Data...</p>
                            </div>
                        ) : satData?.status === 'success' ? (
                            <div className="space-y-5">
                                {/* Visual Preview */}
                                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900 aspect-video">
                                    {satData.imagery?.visualUrl ? (
                                        <img
                                            src={satData.imagery.visualUrl}
                                            alt="Satellite Visual"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Satellite className="w-12 h-12 text-slate-700 animate-bounce" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex flex-col justify-end p-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Last Pass</p>
                                                <p className="text-sm font-black text-white uppercase tracking-tight">{satData.imagery?.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Cloud Cover</p>
                                                <p className="text-sm font-black text-white uppercase tracking-tight">{satData.imagery?.cloudCover.toFixed(1)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">Cloud Optimized</span>
                                        {(satData.imagery as any)?.sensorType === 'Sentinel-1 (Radar)' && (
                                            <span className="bg-indigo-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg flex items-center gap-1">
                                                <Activity className="w-2 h-2" /> All-Weather SAR
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* NDWI Analysis Card */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-5"><Zap className="w-20 h-20 text-indigo-600" /></div>
                                    <h5 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Activity className="w-3.5 h-3.5" /> {(satData.imagery as any)?.sensorType === 'Sentinel-1 (Radar)' ? 'Radar Backscatter Analysis' : 'NDWI Water Index'}
                                    </h5>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/60 p-3 rounded-xl border border-indigo-200/50">
                                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Spectral Bands</p>
                                                <p className="text-xs font-black text-indigo-900">{(satData.imagery as any)?.sensorType === 'Sentinel-1 (Radar)' ? 'VV + VH Polarizations' : 'B03 (G) + B08 (NIR)'}</p>
                                            </div>
                                            <div className="bg-white/60 p-3 rounded-xl border border-indigo-200/50">
                                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Spatial Res</p>
                                                <p className="text-xs font-black text-indigo-900">10 Meters</p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-white/80 rounded-xl border border-indigo-200">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Detection Signal</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse"></div>
                                                <p className="text-[11px] font-bold text-slate-700 leading-tight">
                                                    {(satData.imagery as any)?.sensorType === 'Sentinel-1 (Radar)'
                                                        ? 'SAR ANOMALY: MICROWAVE BACKSCATTER CONFIRMS STANDING WATER'
                                                        : 'POSITIVE WATER CONCENTRATION DETECTED IN RIVERBED ALPHA'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Specs */}
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                        <Info className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Source: Planetary Computer</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Provider: Microsoft / EU Copernicus</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                        <Cloud className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Status: Atmospheric Correction L2A</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bottom-of-Atmosphere Reflectance</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                <Satellite className="w-10 h-10 text-slate-300 mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-10 leading-relaxed">
                                    {satData?.message || "No Cloud-Free Satellite Data Available for Current Observation Cycle"}
                                </p>
                                <button className="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Retry Orbital Link</button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default RightPanelTabs;
