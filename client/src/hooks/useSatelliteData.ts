import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000';

export interface SatelliteData {
    status: 'success' | 'no_data' | 'error';
    imagery?: {
        date: string;
        datetime: string;
        cloudCover: number;
        visualUrl: string | null;
        sensorType?: string;
        bands?: {
            B03: string;
            B08: string;
        };
    };
    ndwi?: {
        formula: string;
        interpretation: {
            high: string;
            moderate: string;
            low: string;
        };
        bandsAvailable: boolean;
    };
    radar?: {
        interpretation: {
            high: string;
            mode: string;
        };
    };
    metadata?: {
        source: string;
        resolution: string;
        bbox: number[];
        cached: boolean;
        cacheAge?: number;
        stale?: boolean;
        timestamp: number;
    };
    message?: string;
    searchParams?: {
        lat: number;
        lng: number;
        date: string;
        radius: number;
    };
}

interface UseSatelliteDataOptions {
    lat: number;
    lng: number;
    radius?: number;
    date?: string;
    enabled?: boolean;
}

export const useSatelliteData = (options: UseSatelliteDataOptions) => {
    const { lat, lng, radius, date, enabled = true } = options;
    const [data, setData] = useState<SatelliteData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSatelliteData = async () => {
        if (!enabled) return;

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                lat: lat.toString(),
                lng: lng.toString(),
            });

            if (radius) params.append('radius', radius.toString());
            if (date) params.append('date', date);

            const response = await fetch(`${API_URL}/api/satellite/flood-risk?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch satellite data';
            setError(errorMessage);
            console.error('Satellite data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (enabled && lat && lng) {
            fetchSatelliteData();
        }
    }, [lat, lng, radius, date, enabled]);

    const refetch = () => {
        fetchSatelliteData();
    };

    return {
        data,
        loading,
        error,
        refetch
    };
};
