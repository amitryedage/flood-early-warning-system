import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export interface FloodData {
    waterLevel: number;
    rainfall: number;
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    timestamp: number;
    weather: {
        temperature: number;
        condition: string;
        icon: string;
        humidity: number | null;
        windSpeed: number | null;
        description: string | null;
        pressure: number | null;
        visibility: number | null;
        cloudiness: number | null;
        location: string | null;
    };
    responders: Array<{ id: string; name: string; lat: number; lng: number; status: string }>;
    villages: Array<{ id: string; name: string; riskLevel: number; population: number; lat: number; lng: number; status: string; satelliteVerified?: boolean }>;
    tasks: Array<{ id: string; type: string; title: string; status: string; urgency: string; assignedTo: string; lat?: number; lng?: number }>;
    forecast: Array<{ timestamp: number; waterLevel: number }>;
    history: Array<{ timestamp: number; waterLevel: number; rainfall: number }>;
    satelliteIntelligence?: {
        status: string;
        lastUpdated: string | number;
        message: string | null;
        cloudCover: number | null;
        visualUrl: string | null;
        sensorType?: string;
    };
}

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [floodData, setFloodData] = useState<FloodData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to Flood Server');
        });

        newSocket.on('flood-update', (data: FloodData) => {
            setFloodData(data);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return { socket, floodData, isConnected };
};
