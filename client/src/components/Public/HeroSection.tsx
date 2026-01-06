import React, { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    onSearch: (term: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
    const [location, setLocation] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (location.trim()) {
            onSearch(location);
        }
    };

    return (
        <div className="relative w-full h-[500px] mb-12 rounded-3xl overflow-hidden shadow-2xl group">
            {/* Dynamic Background Layer */}
            <div className="absolute inset-0 bg-slate-900">
                {/* Animated Gradient Mesh */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-cyan-600/30 via-blue-900/40 to-slate-900/90 animate-spin-slow opacity-70"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1454789476662-53eb23ba5907?q=80&w=2552&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/30"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">

                {/* Status Pill */}
                <div className="mb-6 animate-in slide-in-from-top-4 duration-700 delay-100">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-lg shadow-emerald-900/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Operational
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight leading-none drop-shadow-2xl animate-in slide-in-from-bottom-4 duration-700 delay-200">
                    Stay Ahead of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">The Rising Tide</span>
                </h1>

                <p className="max-w-xl text-slate-300 text-lg font-medium mb-10 leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-300">
                    Real-time flood monitoring and early warning system for the Godavari Basin.
                    Check your sector safety status instantly.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-lg relative group animate-in slide-in-from-bottom-4 duration-700 delay-400">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl group-hover:bg-cyan-500/30 transition-all duration-500"></div>
                    <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl transition-all focus-within:bg-white/20 focus-within:border-white/40 focus-within:scale-[1.02]">
                        <div className="pl-4 text-slate-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Enter your village or pincode..."
                            className="w-full bg-transparent border-none text-white placeholder:text-slate-400 px-4 py-4 focus:ring-0 text-sm font-bold tracking-wide outline-none"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20 active:scale-95">
                            Check
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                {/* Stats Row */}
                <div className="absolute bottom-8 left-0 w-full flex justify-center gap-12 animate-in fade-in duration-1000 delay-500">
                    <div className="text-center">
                        <div className="text-2xl font-black text-white mb-1">42</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Sensors</div>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white mb-1">0</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical Alerts</div>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white mb-1">24/7</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monitoring</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
