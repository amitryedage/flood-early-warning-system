import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Zap, AlertTriangle } from 'lucide-react';

const OperationalTicker: React.FC = () => {
    const [logs, setLogs] = useState<Array<{ id: number, text: string, type: 'info' | 'warn' | 'success' | 'alert', time: string }>>([]);

    const messages = [
        { text: "AI Analysis: Rainfall intensity correlation 0.94. Monitoring for peak surge.", type: 'info' },
        { text: "Downstream prediction updated: Sector Delta risk increased by 15%.", type: 'warn' },
        { text: "Satellite Sync: Sentinel-2 pass complete. NDWI layers updated.", type: 'success' },
        { text: "Telemetry: Sensor SE-104 battery low. Secondary uplink initialized.", type: 'info' },
        { text: "Rescue Logistics: Unit Charlie ETA to Shelter S1 optimized via AI Route.", type: 'success' },
        { text: "Critical: Water level threshold 14.5m approach detected at upstream basin.", type: 'alert' }
    ];

    useEffect(() => {
        // Initial logs with explicit casting to fix lint
        const initialLogs = messages.slice(0, 3).map((m, i) => ({
            ...m,
            id: i,
            time: new Date().toLocaleTimeString(),
            type: m.type as 'success' | 'info' | 'warn' | 'alert'
        }));
        setLogs(initialLogs);

        const interval = setInterval(() => {
            const nextMsg = messages[Math.floor(Math.random() * messages.length)];
            setLogs(prev => [
                { id: Date.now(), text: nextMsg.text, type: nextMsg.type as any, time: new Date().toLocaleTimeString() },
                ...prev.slice(0, 4)
            ]);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const getColor = (type: string) => {
        switch (type) {
            case 'warn': return 'text-orange-500';
            case 'success': return 'text-emerald-500';
            case 'alert': return 'text-red-500';
            default: return 'text-cyan-600';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'warn': return AlertTriangle;
            case 'success': return Zap;
            case 'alert': return Terminal;
            default: return Activity;
        }
    };

    return (
        <div className="bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-800 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Terminal className="w-20 h-20 text-white" />
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">AI Operational Intelligence Ticker</h3>
            </div>

            <div className="space-y-3 font-mono">
                {logs.map((log) => {
                    const Icon = getIcon(log.type);
                    return (
                        <div key={log.id} className="flex gap-3 text-[10px] items-start animate-in slide-in-from-left duration-500">
                            <span className="text-slate-600 font-bold shrink-0">[{log.time}]</span>
                            <Icon className={`w-3 h-3 mt-0.5 shrink-0 ${getColor(log.type)}`} />
                            <p className={`font-medium tracking-tight ${log.type === 'alert' ? 'text-white' : 'text-slate-400'}`}>
                                {log.text}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OperationalTicker;
