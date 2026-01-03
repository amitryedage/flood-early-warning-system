import React, { useState, useEffect } from 'react';
import MapContainer from '../../components/Map/MapContainer';
import SystemStatus from '../../components/Overlay/SystemStatus';
import SimulationPanel from '../../components/Controls/SimulationPanel';

// Type Definition
interface Zone {
    lat: number;
    lng: number;
    radius: number;
    severity: 'MODERATE' | 'HIGH';
}

// Mock Data for the Demo
const INITIAL_ZONES: Zone[] = [
    { lat: 20.5937, lng: 78.9629, radius: 250000, severity: 'MODERATE' },
];

const WarRoom: React.FC = () => {
    // Demo State
    const [waterLevel, setWaterLevel] = useState(12.4);
    const [rainfall, setRainfall] = useState(45);
    const [status, setStatus] = useState<'NORMAL' | 'WARNING' | 'CRITICAL'>('NORMAL');
    const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);

    // Simulation Effect (The "Demo Mode")
    useEffect(() => {
        const interval = setInterval(() => {
            // Logic: If status is manually set to critical via simulation panel (indirectly via props if I wired it back? 
            // Actually the SimulationPanel props change state here.
            // But we also want auto-update? 
            // For now, let's just let the simulation panel control it mostly, or have this run "simulation" if not paused.
            // I'll keep the auto-increment for the "Live" feel.

            setWaterLevel(prev => {
                // If it's already critical, maybe don't loop forever, but fluctuate
                const noise = (Math.random() - 0.3) * 0.1;
                const newVal = prev + (prev < 15 ? 0.05 : 0) + noise;

                // Trigger alerts based on level
                if (newVal > 14.0) setStatus('CRITICAL');
                else if (newVal > 13.0) setStatus('WARNING');
                else setStatus('NORMAL');

                return newVal;
            });

            setRainfall(prev => prev + (Math.random() - 0.5) * 5);

            // Update zones based on status
            setZones(prev => prev.map(z => ({
                ...z,
                radius: status === 'CRITICAL' ? 400000 : 250000,
                severity: status === 'CRITICAL' ? 'HIGH' : 'MODERATE'
            })));

        }, 2000);

        return () => clearInterval(interval);
    }, [status]); // Depend on status to trigger re-eval of logic if needed

    return (
        <div className="relative w-full h-full">
            {/* Floating Overlays */}
            <SystemStatus status={status} waterLevel={waterLevel} rainfall={Math.floor(rainfall)} />

            {/* Map Background */}
            <div className="absolute inset-0 z-0">
                <MapContainer floodZones={zones} />
            </div>

            {/* Simulation Controls */}
            <SimulationPanel
                waterLevel={waterLevel}
                setWaterLevel={setWaterLevel}
                rainfall={rainfall}
                setRainfall={setRainfall}
                status={status}
            />
        </div>
    );
};

export default WarRoom;
