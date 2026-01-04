import { Map, Navigation, CheckCircle, Radio, MapPin, LogOut } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../config/supabase';

const ResponderLayout: React.FC = () => {
    const { socket, floodData, isConnected } = useSocket();
    const { user } = useAuth();
    const myUnitId = user?.user_metadata?.unitId || 'alpha'; // Fallback to alpha
    const unitName = user?.user_metadata?.fullName || 'FIELD-UNIT';

    // Filter tasks assigned to this unit
    const myTasks = floodData?.tasks.filter(t => t.assignedTo === myUnitId) || [];
    const pendingCount = myTasks.filter(t => t.status !== 'COMPLETED').length;

    const handleUpdateStatus = (taskId: string, status: string) => {
        if (socket) {
            socket.emit('task-status-update', { taskId, status });
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const simulateMove = () => {
        if (socket && floodData) {
            const me = floodData.responders.find(r => r.id === myUnitId);
            if (me) {
                // Slightly nudge position for demo
                const newLat = me.lat + (Math.random() - 0.5) * 0.01;
                const newLng = me.lng + (Math.random() - 0.5) * 0.01;
                socket.emit('responder-update', { id: myUnitId, lat: newLat, lng: newLng });
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-mono">
            {/* Field App Header */}
            <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400 text-slate-900 rounded-lg">
                        <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-yellow-400">{unitName}</h1>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-black">
                            {floodData?.status === 'CRITICAL' ? '⚠️ RED ALERT ACTIVE' : 'Status: Normal Patrol'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded text-[10px] font-black tracking-widest border ${isConnected ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border-red-500/50 text-red-400 bg-red-500/10'
                        }`}>
                        {isConnected ? 'LIVE' : 'OFFLINE'}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition-all shadow-md active:scale-95"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Critical Tasks */}
            <main className="p-4 flex-1">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-slate-300">Priority Tasks</h2>
                        <div className="h-1 w-12 bg-yellow-400 mt-1"></div>
                    </div>
                    <span className="bg-red-500/20 text-red-500 text-xs px-3 py-1 rounded-full font-black">
                        {pendingCount} PENDING
                    </span>
                </div>

                <div className="space-y-4 mb-20">
                    {myTasks.length === 0 ? (
                        <div className="py-12 flex flex-col items-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                            <CheckCircle className="w-12 h-12 mb-2 opacity-20" />
                            <p className="font-bold">ALL CLEAR</p>
                            <p className="text-xs">Waiting for dispatch orders...</p>
                        </div>
                    ) : (
                        myTasks.map(task => (
                            <div key={task.id} className={`bg-slate-800 rounded-2xl p-6 border-l-8 shadow-2xl transition-all ${task.status === 'COMPLETED' ? 'border-emerald-500 opacity-60' :
                                task.urgency === 'HIGH' ? 'border-red-500' : 'border-orange-500'
                                }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{task.type}</span>
                                        <h3 className="font-black text-xl leading-tight mt-1">{task.title}</h3>
                                    </div>
                                    <div className={`p-2 rounded-lg ${task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                        {task.status === 'COMPLETED' ? <CheckCircle size={20} /> : <Navigation size={20} />}
                                    </div>
                                </div>

                                {task.status !== 'COMPLETED' && (
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <button
                                            onClick={() => handleUpdateStatus(task.id, 'EN_ROUTE')}
                                            className={`py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${task.status === 'EN_ROUTE' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                                                }`}
                                        >
                                            <Map size={16} /> {task.status === 'EN_ROUTE' ? 'EN ROUTE' : 'SET ROUTE'}
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                                        >
                                            <CheckCircle size={16} /> COMPLETE
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Controls */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
                    <button
                        onClick={simulateMove}
                        className="w-full bg-slate-100 text-slate-900 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    >
                        <MapPin size={18} /> BROADCAST GPS POSITION
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ResponderLayout;
