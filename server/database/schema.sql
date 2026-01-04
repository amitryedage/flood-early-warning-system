-- 1. SYSTEM STATE (Collection)
CREATE TABLE IF NOT EXISTS system_state (
    id TEXT PRIMARY KEY DEFAULT 'current',
    water_level DECIMAL NOT NULL,
    rainfall DECIMAL NOT NULL,
    status TEXT NOT NULL,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    weather JSONB
);

-- 2. WATER LEVEL HISTORY
CREATE TABLE IF NOT EXISTS water_level_history (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    water_level DECIMAL NOT NULL,
    rainfall DECIMAL NOT NULL
);

-- 3. RESPONDERS
CREATE TABLE IF NOT EXISTS responders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    urgency TEXT NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    assigned_to TEXT REFERENCES responders(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBSCRIBERS
CREATE TABLE IF NOT EXISTS subscribers (
    id BIGSERIAL PRIMARY KEY,
    contact TEXT NOT NULL,
    method TEXT NOT NULL,
    district TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial State Seed
INSERT INTO system_state (id, water_level, rainfall, status) 
VALUES ('current', 12.0, 50, 'NORMAL')
ON CONFLICT (id) DO NOTHING;
