import React, { useState, useEffect } from 'react';
import { Radio, Wifi, Battery, Signal, Maximize2 } from 'lucide-react';

const CCTVFeed: React.FC = () => {
    const [selectedCam, setSelectedCam] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const cams = [
        { id: 1, name: 'Krishna River - Bank A', url: '/assets/cctv/cam1.png', status: 'ONLINE' },
        { id: 2, name: 'Koyna Dam - Gate 4', url: '/assets/cctv/cam2.png', status: 'ONLINE' },
        { id: 3, name: 'Irwin Bridge Sector', url: '/assets/cctv/cam3.png', status: 'ONLINE' },
        { id: 4, name: 'Market Yard Lowland', url: '/assets/cctv/cam4.png', status: 'SIGNAL_WEAK' },
    ];

    const formatTime = (date: Date) => {
        return date.toISOString().replace('T', ' ').split('.')[0];
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-500 animate-pulse" /> Live Surveillance Grid
                </h4>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">W.R.E.N NETWORK</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {cams.map((cam) => (
                    <div
                        key={cam.id}
                        onClick={() => setSelectedCam(cam.id)}
                        className="relative group aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 cursor-pointer hover:border-cyan-500 transition-all shadow-lg"
                    >
                        {/* Image Layer with Filters */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={cam.url}
                                alt={cam.name}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                style={{ filter: 'grayscale(40%) contrast(120%) brightness(90%) sepia(20%)' }} // CCTV look
                            />
                            {/* Scanline Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>
                            {/* Vignette */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
                        </div>

                        {/* OSD Overlay */}
                        <div className="absolute inset-0 z-10 p-2 flex flex-col justify-between pointer-events-none">
                            <div className="flex justify-between items-start">
                                <span className="bg-black/60 text-white text-[8px] font-mono px-1 rounded uppercase backdrop-blur-sm">CAM 0{cam.id}</span>
                                {cam.status === 'ONLINE' ? (
                                    <Wifi className="w-3 h-3 text-emerald-500" />
                                ) : (
                                    <Signal className="w-3 h-3 text-yellow-500 animate-pulse" />
                                )}
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[8px] text-emerald-500 font-mono shadow-sm">{formatTime(currentTime)}</span>
                                <Battery className="w-3 h-3 text-emerald-500" />
                            </div>
                        </div>

                        {/* Glitch Overlay (Simulated) */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 animate-pulse pointer-events-none"></div>

                        {/* Hover Action */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-[10px] font-mono flex items-center justify-between">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-500">OPTIMAL</span>
            </div>

            {/* Expanded View Modal (Simplified as absolute cover for now) */}
            {selectedCam && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300" onClick={() => setSelectedCam(null)}>
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                        <img
                            src={cams.find(c => c.id === selectedCam)?.url}
                            className="w-full h-full object-cover"
                            style={{ filter: 'grayscale(20%) contrast(120%)' }}
                        />
                        {/* Fullscreen OSD */}
                        <div className="absolute top-6 left-6 flex flex-col gap-1">
                            <span className="text-red-600 font-black tracking-widest animate-pulse flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-full"></div> LIVE REC</span>
                            <span className="text-white font-mono text-xl uppercase tracking-widest">{cams.find(c => c.id === selectedCam)?.name}</span>
                        </div>
                        <div className="absolute bottom-6 right-6 text-white font-mono text-xl tracking-widest">
                            {formatTime(currentTime)}
                        </div>
                        {/* Scanlines */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
                    </div>
                    <div className="absolute bottom-10 text-slate-500 font-mono text-xs">CLICK ANYWHERE TO CLOSE SECURE FEED</div>
                </div>
            )}
        </div>
    );
};

export default CCTVFeed;
