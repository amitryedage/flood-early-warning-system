require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { setupSecurity } = require('./middleware/security');
const validate = require('./middleware/validate');
const { z } = require('zod');
const { startSimulation, getCurrentState, forceUpdate } = require('./services/simulationService');

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

// Routes
app.get('/', (req, res) => {
    res.send('Flood Early Warning System API is running');
});

// API: Get current status
app.get('/api/status', (req, res) => {
    res.json(getCurrentState());
});

// API: God Mode (Simulate Disaster) - Protected by simplistic check for demo
const GodModeSchema = z.object({
    waterLevel: z.number().optional(),
    rainfall: z.number().optional()
});

app.post('/api/simulate', validate(GodModeSchema), (req, res) => {
    const newState = forceUpdate(req.body);
    // Broadcast immediately
    io.emit('flood-update', newState);
    res.json({ message: 'Simulation Updated', state: newState });
});

// Socket.io
io.on('connection', (socket) => {
    // Send immediate state on connection
    socket.emit('flood-update', getCurrentState());

    socket.on('disconnect', () => {
        // console.log('Client disconnected');
    });
});

// Start Simulation Background Service
startSimulation(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
