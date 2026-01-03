import React from 'react';
import { motion } from 'framer-motion';

interface SystemStatusProps {
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    waterLevel: number;
    rainfall: number;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ status, waterLevel, rainfall }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'CRITICAL': return 'text-red-500 shadow-red-500/50';
            case 'WARNING': return 'text-orange-500 shadow-orange-500/50';
            case 'NORMAL': return 'text-emerald-500 shadow-emerald-500/50';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-6 z-50 p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow-2xl w-80"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-400 text-sm font-semibold tracking-wider uppercase">System Status</h2>
                <div className={`h-3 w-3 rounded-full ${status === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
            </div>

            <div className={`text-2xl font-bold mb-6 ${getStatusColor()} drop-shadow-lg`}>
                {status}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Water Level</span>
                    <span className="text-2xl font-mono text-cyan-400 font-bold">{waterLevel.toFixed(1)}m</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(waterLevel / 20) * 100}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-slate-400">Rainfall</span>
                    <span className="text-xl font-mono text-blue-400">{rainfall}mm/hr</span>
                </div>
            </div>
        </motion.div>
    );
};

export default SystemStatus;
