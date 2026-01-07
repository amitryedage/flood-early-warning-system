const { z } = require('zod');
const { fetchWeatherData } = require('./weatherService');
const logger = require('../utils/logger');
const dbService = require('./databaseService');

// Default monitoring location (Sangli, Maharashtra, India)
const DEFAULT_LAT = parseFloat(process.env.DEFAULT_LAT) || 16.8524;
const DEFAULT_LNG = parseFloat(process.env.DEFAULT_LNG) || 74.5815;
const WEATHER_UPDATE_INTERVAL = parseInt(process.env.WEATHER_UPDATE_INTERVAL) || 300000; // 5 minutes

// Initial State
let currentState = {
    waterLevel: 12.0, // meters
    rainfall: 50, // mm/hr
    status: 'NORMAL',
    timestamp: Date.now(),
    // Weather data (will be populated from API)
    weather: {
        temperature: null,
        humidity: null,
        windSpeed: null,
        condition: null,
        description: null,
        icon: null,
        pressure: null,
        visibility: null,
        cloudiness: null,
        location: null
    },
    // Responder Units State
    responders: [
        { id: 'alpha', name: 'UNIT-ALPHA (NDRF)', lat: 16.8550, lng: 74.5850, status: 'ON_DUTY', lastUpdate: Date.now() },
        { id: 'beta', name: 'UNIT-BETA (FIRE)', lat: 16.8490, lng: 74.5800, status: 'ON_DUTY', lastUpdate: Date.now() },
        { id: 'charlie', name: 'UNIT-CHARLIE (MED)', lat: 16.8400, lng: 74.6000, status: 'EN_ROUTE', lastUpdate: Date.now() },
        { id: 'delta', name: 'UNIT-DELTA (LOGS)', lat: 16.8700, lng: 74.6200, status: 'ON_SITE', lastUpdate: Date.now() },
        { id: 'echo', name: 'UNIT-ECHO (SDRF)', lat: 16.8300, lng: 74.5600, status: 'ON_DUTY', lastUpdate: Date.now() }
    ],
    // Emergency Tasks
    tasks: [
        { id: 't1', type: 'EVACUATION', title: 'Evacuate Sangliwadi Sector', lat: 16.8600, lng: 74.5700, status: 'PENDING', urgency: 'HIGH', assignedTo: 'alpha' },
        { id: 't2', type: 'MEDICAL', title: 'Medical Camp Setup', lat: 16.8450, lng: 74.6000, status: 'IN_PROGRESS', urgency: 'MODERATE', assignedTo: 'charlie' },
        { id: 't3', type: 'LOGISTICS', title: 'Sandbagging Krishna Ghat', lat: 16.8520, lng: 74.5800, status: 'PENDING', urgency: 'HIGH', assignedTo: 'beta' }
    ],
    // Villages / Zones State
    villages: [
        { id: 'v1', name: 'Miraj MIDC', baseRisk: 10, population: 45000, lat: 16.8200, lng: 74.6400, status: 'SAFE', riskLevel: 10 },
        { id: 'v2', name: 'Haripur Ghat', baseRisk: 40, population: 15000, lat: 16.8300, lng: 74.5700, status: 'SAFE', riskLevel: 40 },
        { id: 'v3', name: 'Sangliwadi', baseRisk: 50, population: 22000, lat: 16.8650, lng: 74.5650, status: 'SAFE', riskLevel: 50 },
        { id: 'v4', name: 'Udgaon Bridge', baseRisk: 30, population: 12000, lat: 16.8800, lng: 74.5200, status: 'SAFE', riskLevel: 30 },
        { id: 'v5', name: 'Bhilawadi', baseRisk: 25, population: 8000, lat: 16.9500, lng: 74.4500, status: 'SAFE', riskLevel: 25 },
        { id: 'v6', name: 'Vishrambag', baseRisk: 5, population: 55000, lat: 16.8400, lng: 74.6000, status: 'SAFE', riskLevel: 5 },
        { id: 'v7', name: 'Madhavnagar', baseRisk: 15, population: 30000, lat: 16.8700, lng: 74.6200, status: 'SAFE', riskLevel: 15 },
        { id: 'v8', name: 'Kupwad', baseRisk: 8, population: 40000, lat: 16.8400, lng: 74.6500, status: 'SAFE', riskLevel: 8 },
        { id: 'v9', name: 'Kasabe Digraj', baseRisk: 35, population: 18000, lat: 16.8900, lng: 74.5500, status: 'SAFE', riskLevel: 35 }
    ],
    // 24h Forecast (hourly)
    forecast: [],
    // Recent History (last 50 points)
    history: [],
    // Satellite Intelligence (NDWI)
    satelliteIntelligence: {
        status: 'pending',
        lastUpdated: null,
        message: null,
        cloudCover: null,
        visualUrl: null
    }
};

// Zod Schema for input validation (if we allowed external updates)
const UpdateSchema = z.object({
    waterLevel: z.number().optional(),
    rainfall: z.number().optional()
});

/**
 * Fetch and update weather data
 */
const updateWeatherData = async () => {
    try {
        console.log('🌤️  Fetching weather data...');
        const weatherData = await fetchWeatherData(DEFAULT_LAT, DEFAULT_LNG);

        // Update state with real weather data
        currentState.weather = {
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            windSpeed: weatherData.windSpeed,
            condition: weatherData.condition,
            description: weatherData.description,
            icon: weatherData.icon,
            pressure: weatherData.pressure,
            visibility: weatherData.visibility,
            cloudiness: weatherData.cloudiness,
            location: weatherData.location
        };

        // Use real rainfall data if available, otherwise keep simulated
        if (weatherData.rainfall !== undefined) {
            currentState.rainfall = weatherData.rainfall;
        }

        logger.info(`🌤️ Weather updated: ${weatherData.temperature}°C, ${weatherData.condition}`);
    } catch (error) {
        logger.error(`❌ Failed to fetch weather data: ${error.message}`);
        // Keep using existing state on error
    }
};

/**
 * Starts the simulation loop
 * @param {import('socket.io').Server} io 
 */
const startSimulation = (io) => {
    logger.info('🚀 Starting Flood Simulation Service...');
    logger.info(`📍 Monitoring location: ${DEFAULT_LAT}°N, ${DEFAULT_LNG}°E`);

    // Resume from last state in DB
    dbService.getLastState().then(lastState => {
        if (lastState) {
            logger.info('💾 Resuming simulation from database state...');
            currentState.waterLevel = parseFloat(lastState.water_level);
            currentState.rainfall = parseFloat(lastState.rainfall);
            currentState.status = lastState.status;
            // Merge weather if exists
            if (lastState.weather) currentState.weather = lastState.weather;
        }
    });

    // Fetch initial weather data
    updateWeatherData();

    // Weather update interval (every 5 minutes to respect API limits)
    setInterval(updateWeatherData, WEATHER_UPDATE_INTERVAL);

    // Fast simulation interval (every 3 seconds for water level simulation)
    setInterval(() => {
        // 1. Simulate Water Level Changes
        currentState.waterLevel = calculateNewWaterLevel(currentState.waterLevel, currentState.rainfall);

        // 2. Determine Risk Status based on water level
        currentState.status = determineRiskStatus(currentState.waterLevel);

        // 2b. Update Village Statuses dynamically
        const satIntel = currentState.satelliteIntelligence;
        currentState.villages = currentState.villages.map(v => {
            // Simple risk model: Risk increases with water level
            const waterFactor = Math.max(0, (currentState.waterLevel - 10) * 10);
            let dynamicRisk = Math.min(100, v.baseRisk + waterFactor);

            // SATELLITE OVERRIDE: If satellite confirms water expansion at this coordinate
            // (Simulated logic: if satellite status is success and it's a high-water event)
            let satelliteVerified = false;
            if (satIntel.status === 'success' && currentState.waterLevel > 14.0) {
                // If it's a high-water event, satellite "identifies" risk at low-lying villages
                if (v.baseRisk > 30) {
                    dynamicRisk = Math.max(dynamicRisk, 95); // Force high risk
                    satelliteVerified = true;
                }
            }

            let status = 'SAFE';
            if (dynamicRisk > 80) status = 'CRITICAL';
            else if (dynamicRisk > 50) status = 'WARNING';

            return {
                ...v,
                riskLevel: Math.round(dynamicRisk),
                status,
                satelliteVerified
            };
        });

        currentState.timestamp = Date.now();

        // 3. Emit Real-Time Update to ALL Clients
        io.emit('flood-update', currentState);

        // If Critical, emit specific alert
        if (currentState.status === 'CRITICAL') {
            const alert = {
                id: Date.now(),
                type: 'EVACUATION',
                message: `Water Level Critical (${currentState.waterLevel.toFixed(1)}m). Evacuate Zone A immediately.`,
                severity: 'HIGH'
            };
            io.emit('alert-new', alert);

            // Persist Alert to Database
            dbService.saveAlert(alert);
        }

        // 4. Update Forecast
        generateForecast();

        // 5. Log History (Local)
        logHistory();

        // 6. Persist to Database (Supabase)
        dbService.updateLiveState(currentState);
        dbService.logWaterHistory(currentState.waterLevel, currentState.rainfall);

    }, 3000); // 3-second heartbeat
};

const logHistory = () => {
    const dataPoint = {
        timestamp: currentState.timestamp,
        waterLevel: currentState.waterLevel,
        rainfall: currentState.rainfall
    };

    currentState.history.push(dataPoint);

    // Keep last 50 points (approx 2.5 minutes of history)
    if (currentState.history.length > 50) {
        currentState.history.shift();
    }
};

const generateForecast = () => {
    const forecast = [];
    const now = Date.now();
    let projectedLevel = currentState.waterLevel;

    // Project 24 hours (hourly steps)
    for (let i = 1; i <= 24; i++) {
        const hourTime = now + (i * 3600000);

        // Simulating some volatility in rainfall for forecast
        const rainfallImpact = (currentState.rainfall / 100) * (1 + Math.sin(i / 4) * 0.2);

        if (currentState.rainfall > 80) {
            projectedLevel += 0.2 + rainfallImpact;
        } else if (currentState.rainfall < 20) {
            projectedLevel -= 0.05;
        } else {
            projectedLevel += 0.02 + rainfallImpact;
        }

        // Cap values
        projectedLevel = Math.max(10.0, Math.min(25.0, projectedLevel));

        forecast.push({
            timestamp: hourTime,
            waterLevel: parseFloat(projectedLevel.toFixed(2))
        });
    }
    currentState.forecast = forecast;
};

const getCurrentState = () => currentState;

// Function to manually override state (God Mode)
const forceUpdate = (updates) => {
    try {
        const validated = UpdateSchema.parse(updates);
        currentState = { ...currentState, ...validated };
        return currentState;
    } catch (error) {
        throw error;
    }
};

// Task & Responder Handlers
const dispatchTask = (task) => {
    const newTask = {
        id: `t-${Date.now()}`,
        status: 'PENDING',
        ...task
    };
    currentState.tasks.push(newTask);
    return newTask;
};

const updateTaskStatus = (taskId, status) => {
    const task = currentState.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = status;
        return task;
    }
    return null;
};

const updateResponderPosition = (id, lat, lng) => {
    const responder = currentState.responders.find(r => r.id === id);
    if (responder) {
        responder.lat = lat;
        responder.lng = lng;
        responder.lastUpdate = Date.now();
        return responder;
    }
    return null;
};

/**
 * Logic: Calculate new water level based on current level and rainfall
 * (Extracted for Unit Testing)
 */
const calculateNewWaterLevel = (currentLevel, rainfall) => {
    let nextLevel = currentLevel;
    if (rainfall > 80) {
        nextLevel += 0.05;
    } else if (rainfall < 20) {
        nextLevel -= 0.02;
    } else {
        nextLevel += 0.01;
    }
    return Math.max(10.0, nextLevel);
};

/**
 * Logic: Determine status string based on level
 * (Extracted for Unit Testing)
 */
const determineRiskStatus = (level) => {
    if (level > 14.5) return 'CRITICAL';
    if (level > 13.0) return 'WARNING';
    return 'NORMAL';
};

const updateSatelliteIntelligence = (data) => {
    currentState.satelliteIntelligence = {
        status: data.status,
        lastUpdated: data.imagery?.datetime || Date.now(),
        message: data.message || 'Satellite sync successful',
        cloudCover: data.imagery?.cloudCover,
        visualUrl: data.imagery?.visualUrl,
        sensorType: data.imagery?.sensorType || 'Sentinel-2'
    };
    return currentState.satelliteIntelligence;
};

module.exports = {
    startSimulation,
    getCurrentState,
    forceUpdate,
    dispatchTask,
    updateTaskStatus,
    updateResponderPosition,
    updateSatelliteIntelligence,
    calculateNewWaterLevel, // Exported for tests
    determineRiskStatus     // Exported for tests
};
