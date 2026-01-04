require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function createResponder(email, password) {
    if (!email || !password) {
        logger.error('❌ Usage: node src/utils/createResponder.js <email> <password>');
        return;
    }

    logger.info(`🛠️ Creating Responder user: ${email}...`);

    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'responder' }
        });

        if (error) {
            if (error.message.includes('already registered')) {
                logger.warn('⚠️ User already exists. Updating metadata to responder...');

                const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
                const existingUser = listData?.users?.find(u => u.email === email);

                if (existingUser) {
                    const { error: updateError } = await supabase.auth.admin.updateUserById(
                        existingUser.id,
                        { user_metadata: { role: 'responder' } }
                    );
                    if (updateError) throw updateError;
                    logger.info('✅ User metadata updated to responder.');
                } else {
                    throw listError || new Error('User found in check but not in list');
                }
            } else {
                throw error;
            }
        } else {
            logger.info('✅ Responder user created successfully!');
        }
    } catch (err) {
        logger.error(`❌ Failed to create responder: ${err.message}`);
    }
}

// Support command line arguments or default
const args = process.argv.slice(2);
const email = args[0] || 'responder@fews.gov';
const password = args[1] || 'Field@123';

createResponder(email, password);
