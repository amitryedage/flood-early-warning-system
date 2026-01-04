require('dotenv').config();
const supabase = require('../config/supabase');

async function testConnection() {
    console.log('🔍 Testing Supabase connection...');

    try {
        const { data, error } = await supabase
            .from('system_state')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Supabase Error:', error);
            if (error.code === 'PGRST116' || error.message.includes('not found') || error.code === '42P01') {
                console.warn('⚠️ Table "system_state" not found. This confirms connection is OK but schema is missing.');
            }
        } else {
            console.log('✅ Supabase connection successful!');
            console.log(`📊 Found ${data.length} rows in system_state.`);
        }
    } catch (err) {
        console.error('❌ Fatal connection error:', err);
    }
}

testConnection();
