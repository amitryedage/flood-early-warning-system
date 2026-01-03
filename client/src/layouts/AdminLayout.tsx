import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
    return (
        <div className="relative w-screen h-screen bg-slate-950 overflow-hidden text-slate-200 selection:bg-cyan-500/30">
            {/* Background Map Layer (Z-0) */}
            <div className="absolute inset-0 z-0 bg-slate-900">
                {/* Map Component will be injected here via Outlet or Context if it's shared, 
            but usually the Page handles the main content. 
            For the War Room, the Map IS the Page content. 
        */}
                <div className="grid place-items-center h-full text-slate-600">
                    Loading Global Satellite Feed...
                </div>
            </div>

            {/* Main Content Overlay (Z-10) */}
            <div className="relative z-10 w-full h-full pointer-events-none">
                {/* Child routes (Like WarRoom.tsx) inject their interactive elements here.
            They need 'pointer-events-auto' on their interactive parts.
        */}
                <Outlet />
            </div>

            {/* Global Overlay Elements (Scanlines, Vignette) */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[url('/scanlines.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 pointer-events-none z-40 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40"></div>
        </div>
    );
};

export default AdminLayout;
