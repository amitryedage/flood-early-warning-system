export interface Village {
    id: string;
    name: string;
    riskLevel: number; // 0-100
    population: number;
    status: 'safe' | 'warning' | 'danger' | 'critical';
    lat: number;
    lng: number;
}

export interface Team {
    id: string;
    name: string;
    type: 'NDRF' | 'Fire' | 'Medical' | 'Volunteer';
    status: 'active' | 'standby' | 'en-route' | 'on-site';
    location: string;
    members: number;
}

export interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: string;
    affectedVillages: number;
    populationReached: number;
}

export interface MetricCardConfig {
    id: string;
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
}
