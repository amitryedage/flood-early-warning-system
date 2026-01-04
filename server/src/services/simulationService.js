const { z } = require('zod');
const { fetchWeatherData } = require('./weatherService');
const logger = require('../utils/logger');
const dbService = require('./databaseService');

// Default monitoring location (Godavari River Basin, India)
const DEFAULT_LAT = parseFloat(process.env.DEFAULT_LAT) || 18.0;
const DEFAULT_LNG = parseFloat(process.env.DEFAULT_LNG) || 82.0;
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
        { id: 'alpha', name: 'UNIT-ALPHA', lat: 18.08, lng: 82.18, status: 'ON_DUTY', lastUpdate: Date.now() },
        { id: 'beta', name: 'UNIT-BETA', lat: 17.95, lng: 82.12, status: 'ON_DUTY', lastUpdate: Date.now() }
    ],
    // Emergency Tasks
    tasks: [
        { id: 't1', type: 'EVACUATION', title: 'Evacuate Sector 4B', lat: 18.1, lng: 82.1, status: 'PENDING', urgency: 'HIGH', assignedTo: 'alpha' }
    ],
    // 24h Forecast (hourly)
    forecast: [],
    // Recent History (last 50 points)
    history: []
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

module.exports = {
    startSimulation,
    getCurrentState,
    forceUpdate,
    dispatchTask,
    updateTaskStatus,
    updateResponderPosition,
    calculateNewWaterLevel, // Exported for tests
    determineRiskStatus     // Exported for tests
};
