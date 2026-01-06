import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Bell, MapPin, User, Loader2, Lock } from 'lucide-react';

const PublicNavbar: React.FC = () => {
    const [locationName, setLocationName] = useState('Sector 4, Nashik');
    const [isLocating, setIsLocating] = useState(false);

    const handleLocationClick = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                // Success
                const { latitude, longitude } = position.coords;

                try {
                    // Use OpenStreetMap Nominatim API for reverse geocoding
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();

                    if (data && data.address) {
                        // Extract relevant parts for a short name
                        const city = data.address.city || data.address.town || data.address.village || data.address.county;
                        const state = data.address.state;
                        const area = data.address.suburb || data.address.neighbourhood;

                        const name = area ? `${area}, ${city}` : `${city}, ${state}`;
                        setLocationName(name);
                    } else {
                        setLocationName(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    }
                } catch (error) {
                    console.error("Reverse geocoding error:", error);
                    // Fallback to coordinates if API fails
                    setLocationName(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                // Error
                console.error("Error fetching location:", error);
                alert("Unable to retrieve your location. Please ensure location services are enabled.");
                setIsLocating(false);
            }
        );
    };

    const navigate = useNavigate();

    const handleAdminLogin = () => {
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4 lg:px-6 shadow-sm">
            {/* Left: Logo */}
            <div className="flex items-center gap-2 w-1/4">
                <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-bold text-lg text-slate-800 tracking-tight hidden sm:block">FloodWatch</h1>
            </div>

            {/* Center: Location */}
            <div className="flex-1 flex justify-center">
                <div
                    onClick={handleLocationClick}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-100 transition-colors group"
                >
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">Your Location:</span>
                    <div className="flex items-center gap-1">
                        {isLocating ? (
                            <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                        ) : (
                            <MapPin className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="text-sm font-bold text-slate-800 border-b border-dotted border-slate-400">
                            {isLocating ? 'Locating...' : locationName}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-3 w-1/4">
                <button
                    onClick={handleAdminLogin}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                    <Lock className="w-4 h-4" />
                    <span>Admin Login</span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <button className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                        <User className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default PublicNavbar;
