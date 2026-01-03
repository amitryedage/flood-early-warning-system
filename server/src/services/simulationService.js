const { z } = require('zod');

// Initial State
let currentState = {
    waterLevel: 12.0, // meters
    rainfall: 50, // mm/hr
    status: 'NORMAL',
    timestamp: Date.now()
};

// Zod Schema for input validation (if we allowed external updates)
const UpdateSchema = z.object({
    waterLevel: z.number().optional(),
    rainfall: z.number().optional()
});

/**
 * Starts the simulation loop
 * @param {import('socket.io').Server} io 
 */
const startSimulation = (io) => {
    console.log('Starting Flood Simulation Service...');

    setInterval(() => {
        // 1. Simulate Environmental Changes
        // Random rainfall fluctuation
        const rainChange = (Math.random() - 0.5) * 5;
        currentState.rainfall = Math.max(0, currentState.rainfall + rainChange);

        // Water level rises if rainfall is high (>80mm/hr)
        if (currentState.rainfall > 80) {
            currentState.waterLevel += 0.05;
        } else if (currentState.rainfall < 20) {
            currentState.waterLevel -= 0.02;
        }

        // 2. Mock "Cloud Vision" & "Earth Engine" Analysis
        // Determine Risk Status
        if (currentState.waterLevel > 14.5) {
            currentState.status = 'CRITICAL';
        } else if (currentState.waterLevel > 13.0) {
            currentState.status = 'WARNING';
        } else {
            currentState.status = 'NORMAL';
        }

        currentState.timestamp = Date.now();

        // 3. Emit Real-Time Update to ALL Clients
        io.emit('flood-update', currentState);

        // If Critical, emit specific alert
        if (currentState.status === 'CRITICAL') {
            io.emit('alert-new', {
                id: Date.now(),
                type: 'EVACUATION',
                message: `Water Level Critical (${currentState.waterLevel.toFixed(1)}m). Evacuate Zone A immediately.`,
                severity: 'HIGH'
            });
        }

    }, 3000); // 3-second heartbeat
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

module.exports = { startSimulation, getCurrentState, forceUpdate };
