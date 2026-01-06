import React from 'react';

const AlertsFeed: React.FC = () => {
    // Mock Alerts
    const alerts = [
        { id: 1, type: 'CRITICAL', title: 'Flash Flood Warning', time: '10m ago', desc: 'Sector 4: Water rising rapidly. Move to higher ground.' },
        { id: 2, type: 'WARNING', title: 'Road Closure', time: '1h ago', desc: 'Main Bridge closed due to high water levels.' },
        { id: 3, type: 'INFO', title: 'Weather Update', time: '3h ago', desc: 'Heavy rains expected to continue for 4 hours.' }
    ];

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'CRITICAL': return 'border-red-600 bg-red-50 text-red-900';
            case 'WARNING': return 'border-amber-600 bg-amber-50 text-amber-900';
            default: return 'border-blue-600 bg-blue-50 text-blue-900';
        }
    };

    return (
        <div className="standard-card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 italic tracking-tighter">Recent Alerts</h3>
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            </div>

            <div className="space-y-4">
                {alerts.map(alert => (
                    <div
                        key={alert.id}
                        className={`p-5 rounded-2xl border-l-4 transition-all hover:-translate-x-1 ${getTypeStyles(alert.type)}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">{alert.type}</span>
                            <span className="text-[10px] font-bold opacity-60 uppercase">{alert.time}</span>
                        </div>
                        <h4 className="font-black text-base tracking-tight mb-2 uppercase">{alert.title}</h4>
                        <p className="text-xs font-semibold leading-relaxed opacity-70">
                            {alert.desc}
                        </p>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">
                View All History
            </button>
        </div>
    );
};

export default AlertsFeed;
