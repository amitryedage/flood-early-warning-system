require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { setupSecurity } = require('./middleware/security');
const validate = require('./middleware/validate');
const { z } = require('zod');
const {
    startSimulation,
    getCurrentState,
    forceUpdate,
    dispatchTask,
    updateTaskStatus,
    updateResponderPosition,
    updateSatelliteIntelligence
} = require('./services/simulationService');
const { fetchWeatherData } = require('./services/weatherService');
const { getFloodRiskHeatmap, clearCache } = require('./services/satelliteService');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const dbService = require('./services/databaseService');
const { authenticateToken, authorizeRole } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Apply Security Middleware
setupSecurity(app);

// Standard Middleware
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`, { ip: req.ip });
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('Flood Early Warning System API is running');
});


app.get('/api/status', (req, res) => {
    res.json(getCurrentState());
});


const GodModeSchema = z.object({
    waterLevel: z.number().optional(),
    rainfall: z.number().optional()
});

app.post('/api/simulate', authenticateToken, authorizeRole('admin'), validate(GodModeSchema), (req, res) => {
    const newState = forceUpdate(req.body);
    io.emit('flood-update', newState);
    res.json({ message: 'Simulation Updated', state: newState });
});


const WeatherQuerySchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
});

app.get('/api/weather', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);

       
        const validated = WeatherQuerySchema.parse({ lat, lng });

        const weatherData = await fetchWeatherData(validated.lat, validated.lng);
        res.json({
            status: 'success',
            data: weatherData
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid coordinates',
                errors: error.errors
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch weather data'
        });
    }
});

// API: Get satellite flood risk heatmap
const SatelliteQuerySchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    radius: z.number().min(0.01).max(1).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

app.get('/api/satellite/flood-risk', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const radius = req.query.radius ? parseFloat(req.query.radius) : undefined;
        const date = req.query.date || undefined;

        // Validate parameters
        const validated = SatelliteQuerySchema.parse({ lat, lng, radius, date });

        logger.info(`🛰️  Satellite data requested for ${validated.lat}, ${validated.lng}`);

        const satelliteData = await getFloodRiskHeatmap(
            validated.lat,
            validated.lng,
            validated.radius,
            validated.date
        );

        res.json(satelliteData);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid parameters',
                errors: error.errors
            });
        }
        logger.error(`❌ Satellite API error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch satellite data',
            error: error.message
        });
    }
});

// API: Clear satellite cache (admin only)
app.post('/api/satellite/clear-cache', authenticateToken, authorizeRole('admin'), (req, res) => {
    clearCache();
    res.json({
        status: 'success',
        message: 'Satellite cache cleared'
    });
});


const SubscriptionSchema = z.object({
    contact: z.string().min(1),
    method: z.enum(['SMS', 'EMAIL']),
    district: z.string().optional()
});

app.post('/api/subscribe', async (req, res, next) => {
    try {
        const validated = SubscriptionSchema.parse(req.body);
        const subscriber = await dbService.addSubscriber(
            validated.contact,
            validated.method,
            validated.district || 'General'
        );

        logger.info(`🔔 New Subscriber: ${validated.contact} via ${validated.method}`);

        res.status(201).json({
            status: 'success',
            message: 'Subscription successful',
            data: subscriber
        });
    } catch (error) {
        next(error);
    }
});

// Socket.io
io.on('connection', (socket) => {
    // Send immediate state on connection
    socket.emit('flood-update', getCurrentState());

    // Responder Updates (simulate field activity)
    socket.on('responder-update', ({ id, lat, lng }) => {
        const updated = updateResponderPosition(id, lat, lng);
        if (updated) {
            io.emit('flood-update', getCurrentState());
        }
    });

    // Task Status Updates
    socket.on('task-status-update', ({ taskId, status }) => {
        const updated = updateTaskStatus(taskId, status);
        if (updated) {
            io.emit('flood-update', getCurrentState());
        }
    });

    // Admin Dispatch Task
    socket.on('dispatch-task', (taskData) => {
        const newTask = dispatchTask(taskData);
        io.emit('flood-update', getCurrentState());
        // Specifically notify the unit if assigned
        if (taskData.assignedTo) {
            io.emit(`task-assigned-${taskData.assignedTo}`, newTask);
        }
    });

    socket.on('disconnect', () => {
        // console.log('Client disconnected');
    });
});

// Start Simulation Background Service
startSimulation(io);

// Background Satellite Intelligence Sync (Every 10 minutes)
const syncSatelliteIntelligence = async () => {
    try {
        const data = await getFloodRiskHeatmap(16.8524, 74.5815);
        updateSatelliteIntelligence(data);
        io.emit('flood-update', getCurrentState());
        logger.info('🛰️  Geospatial intelligence loop synced');
    } catch (error) {
        logger.error(`❌ Satellite sync failed: ${error.message}`);
    }
};

// Initial sync and then interval
syncSatelliteIntelligence();
setInterval(syncSatelliteIntelligence, 600000); // 10 minutes

// Global Error Handler (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
});
