
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Log file path
const LOG_FILE = path.resolve(process.cwd(), 'debug_log.txt');

function log(message) {
    const msg = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

fs.writeFileSync(LOG_FILE, '');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const MONGODB_URI = process.env.MONGODB_URI;

log('--- CJ API & DB Integration Debugger ---');

// Define Model (Copy from actual file ensuring no schema issues)
const SystemConfigSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String, default: '' }
}, { timestamps: true });

const SystemConfig = mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);

async function runTest() {
    try {
        log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        log('✅ MongoDB Connected');

        // Check for existing token
        const cached = await SystemConfig.findOne({ key: 'cj_access_token' });

        if (cached) {
            log('ℹ️ Found cached token in DB');
            log(`Values: ${JSON.stringify(cached.value, null, 2)}`);
        } else {
            log('ℹ️ No cached token found in DB. API will be called.');
        }

        log('⚠️ NOTE: This script only checks DB connection. Real test requires running the app.');

    } catch (error) {
        log(`❌ Error: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        log('🔌 Disconnected');
    }
}

runTest();
