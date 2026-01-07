import React, { useState, useEffect } from 'react';
import { Shield, Navigation, Phone, MessageSquare, CheckCircle } from 'lucide-react';

interface RescueStatusProps {
    onClose: () => void;
}

const RescueStatus: React.FC<RescueStatusProps> = ({ onClose }) => {
    const [eta, setEta] = useState(12);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Unit Alpha Dispatched');

    useEffect(() => {
        const interval = setInterval(() => {
            setEta(prev => (prev > 1 ? prev - 1 : 1));
            setProgress(prev => (prev < 100 ? prev + 0.5 : 100));
        }, 3000);

        const statusTimer = setTimeout(() => setStatus('Unit Alpha in your Sector'), 15000);

        return () => {
            clearInterval(interval);
            clearTimeout(statusTimer);
        };
    }, []);

    return (
        <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-8 md:bottom-8 z-[100] md:w-[400px] animate-in slide-in-from-bottom duration-500">
            <div className="bg-slate-900 text-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-800 ring-4 ring-white/10">
                <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Rescue Mission</span>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                        <CheckCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-3xl font-black tracking-tight mb-1">{eta}m <span className="text-red-500 text-xl">ETA</span></h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-blue-500" /> {status}
                            </p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                            <Navigation className="w-6 h-6 text-cyan-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Progress Track */}
                    <div className="relative h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-center">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Assigned Unit</p>
                            <p className="font-black text-sm">NDRF ALPHA-7</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-center">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Current Sector</p>
                            <p className="font-black text-sm">MIRAJ BASIN</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Safety Instruction</p>
                            <p className="text-sm font-medium text-slate-200">Our team is 1.8km away. Stay on high ground and carry a flashlight.</p>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center gap-2 transition-all font-black text-xs">
                                <Phone className="w-4 h-4" /> CALL UNIT
                            </button>
                            <button className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center gap-2 transition-all font-black text-xs">
                                <MessageSquare className="w-4 h-4" /> CHAT
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-950/50 text-center border-t border-slate-800">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Live Telemetry via ISRO Satellite Link</p>
                </div>
            </div>
        </div>
    );
};

export default RescueStatus;
