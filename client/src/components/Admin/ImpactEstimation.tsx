import React from 'react';
import { Users, Home, ShieldAlert, Zap } from 'lucide-react';

interface ImpactEstimationProps {
    waterLevel: number;
    status: string;
}

const ImpactEstimation: React.FC<ImpactEstimationProps> = ({ waterLevel, status }) => {
    //Just Demo purpose that we have added this logic 
    const isCrisis = status === 'CRITICAL' || waterLevel > 14;
    const isWarning = status === 'WARNING' || waterLevel > 13;

    const stats = [
        { label: 'Exposed Population', value: isCrisis ? '12.4K' : isWarning ? '4.2K' : '0.8K', icon: Users, color: isCrisis ? 'text-red-600' : 'text-slate-900' },
        { label: 'Critical Infrastructure', value: isCrisis ? '8 Units' : isWarning ? '2 Units' : 'Secure', icon: ShieldAlert, color: isCrisis ? 'text-red-500' : 'text-slate-900' },
        { label: 'Estimated Damage', value: isCrisis ? '₹4.2 Cr' : isWarning ? '₹1.1 Cr' : 'Nominal', icon: Zap, color: isCrisis ? 'text-red-600' : 'text-slate-900' },
        { label: 'Livestock in Danger', value: isCrisis ? '2,800' : isWarning ? '450' : 'None', icon: Home, color: isCrisis ? 'text-orange-600' : 'text-slate-900' }
    ];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                Impact Assessment Layer
                <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-slate-500">Live Simulation</span>
            </h3>

            <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-slate-400">
                            <stat.icon className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className={`text-xl font-black ${stat.color} tracking-tight`}>
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed text-center">
                    AI recommendation: {isCrisis ? 'Immediate deployment of NDRF Sector C-12' : isWarning ? 'Pre-positioning of assets at Walchand College' : 'Continue monitoring upstream sensors'}
                </p>
            </div>
        </div>
    );
};

export default ImpactEstimation;
