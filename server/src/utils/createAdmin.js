require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        logger.error('❌ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env');
        return;
    }

    logger.info(`🛠️ Creating Admin user: ${email}...`);

    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin' }
        });

        if (error) {
            if (error.message.includes('already registered')) {
                logger.warn('⚠️ User already exists. Attempting to update metadata to admin...');

                // Get user by email to get ID
                const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
                const existingUser = listData?.users?.find(u => u.email === email);

                if (existingUser) {
                    const { error: updateError } = await supabase.auth.admin.updateUserById(
                        existingUser.id,
                        { user_metadata: { role: 'admin' } }
                    );
                    if (updateError) throw updateError;
                    logger.info('✅ User metadata updated to admin.');
                } else {
                    throw listError || new Error('User found in check but not in list');
                }
            } else {
                throw error;
            }
        } else {
            logger.info('✅ Admin user created successfully!');
        }
    } catch (err) {
        logger.error(`❌ Failed to create admin: ${err.message}`);
    }
}

createAdmin();
