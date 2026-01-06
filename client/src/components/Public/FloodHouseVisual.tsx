import React from 'react';

interface FloodHouseVisualProps {
    waterLevel: number; // 10-15 meters
}

const FloodHouseVisual: React.FC<FloodHouseVisualProps> = ({ waterLevel }) => {
    // Calculate flood percentage (10m = 0%, 15m = 100%)
    const floodPercentage = Math.min(100, Math.max(0, ((waterLevel - 10) / 5) * 100));

    return (
        <div className="relative w-full h-64 bg-gradient-to-b from-sky-100 to-blue-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            {/* Sky/Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-blue-100"></div>

            {/* Sun or Storm Clouds */}
            {floodPercentage < 50 ? (
                <div className="absolute top-4 right-8 w-12 h-12 bg-yellow-300 rounded-full shadow-lg shadow-yellow-200/50 animate-pulse"></div>
            ) : (
                <div className="absolute top-2 right-4 w-20 h-10 bg-slate-700 rounded-full opacity-80"></div>
            )}

            {/* House Structure - Isometric Style */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-40 flex flex-col items-center justify-end z-10">
                {/* Roof */}
                <div className="relative w-40 h-16 mb-[-8px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 transform -skew-y-12 origin-bottom-left shadow-lg"></div>
                    <div className="absolute top-0 right-0 w-20 h-16 bg-gradient-to-bl from-red-500 to-red-700 transform skew-y-12 origin-bottom-right"></div>
                </div>

                {/* House Body */}
                <div className="relative w-32 h-24 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 shadow-xl">
                    {/* Door */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-gradient-to-b from-amber-800 to-amber-900 border border-amber-950"></div>

                    {/* Windows */}
                    <div className="absolute top-3 left-3 w-6 h-6 bg-sky-300 border-2 border-slate-700 grid grid-cols-2 gap-[1px]">
                        <div className="bg-sky-400"></div>
                        <div className="bg-sky-400"></div>
                        <div className="bg-sky-400"></div>
                        <div className="bg-sky-400"></div>
                    </div>
                    <div className="absolute top-3 right-3 w-6 h-6 bg-sky-300 border-2 border-slate-700 grid grid-cols-2 gap-[1px]">
                        <div className="bg-sky-400"></div>
                        <div className="bg-sky-400"></div>
                        <div className="bg-sky-400"></div>
                        <div className="bg-sky-400"></div>
                    </div>
                </div>
            </div>

            {/* Ground/Grass */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-600 to-green-500 z-[5]"></div>

            {/* Rising Water */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 transition-all duration-1000 ease-out z-[8] opacity-80"
                style={{ height: `${floodPercentage}% ` }}
            >
                {/* Water Surface Animation */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>

                {/* Waves */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-300/50 animate-[wave_2s_ease-in-out_infinite]"></div>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-4 left-4 z-20">
                <div className={`px - 3 py - 1.5 rounded - full text - xs font - black uppercase tracking - wider shadow - lg ${floodPercentage < 30 ? 'bg-emerald-500 text-white' :
                        floodPercentage < 60 ? 'bg-orange-500 text-white' :
                            'bg-red-600 text-white animate-pulse'
                    } `}>
                    {floodPercentage < 30 ? '✓ SAFE' : floodPercentage < 60 ? '⚠ WARNING' : '🚨 DANGER'}
                </div>
            </div>

            {/* Water Level Indicator */}
            <div className="absolute right-4 top-4 bottom-4 w-8 bg-white/80 backdrop-blur-sm rounded-full border-2 border-slate-300 shadow-lg z-20 overflow-hidden">
                <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-1000"
                    style={{ height: `${floodPercentage}% ` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-black text-slate-700 [writing-mode:vertical-lr] rotate-180">
                        {waterLevel.toFixed(1)}M
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FloodHouseVisual;
