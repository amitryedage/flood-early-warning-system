const supabase = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Updates the real-time system state in Supabase
 */
const updateLiveState = async (state) => {
    try {
        const { error } = await supabase
            .from('system_state')
            .upsert({
                id: 'current',
                water_level: state.waterLevel,
                rainfall: state.rainfall,
                status: state.status,
                last_updated: new Date(state.timestamp).toISOString(),
                weather: state.weather
            });

        if (error) throw error;
    } catch (err) {
        logger.error(`❌ DB: Failed to update live state: ${err.message}`);
    }
};

/**
 * Logs a historical water level data point
 */
const logWaterHistory = async (waterLevel, rainfall) => {
    try {
        const { error } = await supabase
            .from('water_level_history')
            .insert({
                water_level: waterLevel,
                rainfall: rainfall,
                timestamp: new Date().toISOString()
            });

        if (error) throw error;
    } catch (err) {
        logger.error(`❌ DB: Failed to log history: ${err.message}`);
    }
};

/**
 * Records a new alert in the database
 */
const saveAlert = async (alert) => {
    try {
        const { error } = await supabase
            .from('alerts')
            .insert({
                id: `alert-${alert.id}`,
                type: alert.type || 'CRITICAL',
                title: 'Flood Alert',
                message: alert.message,
                severity: alert.severity === 'HIGH' ? 95 : 50,
                status: 'active',
                created_at: new Date().toISOString()
            });

        if (error) throw error;
    } catch (err) {
        logger.error(`❌ DB: Failed to save alert: ${err.message}`);
    }
};

/**
 * Adds a new subscriber for emergency notifications
 */
const addSubscriber = async (contact, method, district) => {
    try {
        const { data, error } = await supabase
            .from('subscribers')
            .insert({
                contact,
                method,
                district
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (err) {
        logger.error(`❌ DB: Failed to add subscriber: ${err.message}`);
        throw err;
    }
};

/**
 * Fetches the last saved state on server startup
 */
const getLastState = async () => {
    try {
        const { data, error } = await supabase
            .from('system_state')
            .select('*')
            .eq('id', 'current')
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (err) {
        logger.error(`❌ DB: Failed to fetch last state: ${err.message}`);
        return null;
    }
};

module.exports = {
    updateLiveState,
    logWaterHistory,
    saveAlert,
    addSubscriber,
    getLastState
};
