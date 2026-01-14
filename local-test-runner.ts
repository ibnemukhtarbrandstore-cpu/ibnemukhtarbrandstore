
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env FIRST
const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading env from:', envPath);
dotenv.config({ path: envPath });

const LOG_FILE = path.resolve(process.cwd(), 'debug_final_log.txt');
function log(msg: any) {
    const s = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
    console.log(s);
    fs.appendFileSync(LOG_FILE, s + '\n');
}
fs.writeFileSync(LOG_FILE, '');

async function run() {
    try {
        log('🚀 Starting Full Flow Test (Dynamic Imports)');

        // Dynamically import AFTER env is loaded
        const { connectDb } = await import('./middleware/mongodb');
        const { SystemConfig } = await import('./models/SystemConfig');
        const { searchCJProducts } = await import('./utils/cjApi');

        log('1. Connecting to DB...');
        await connectDb();
        log('✅ DB Connected');

        log('2. checking SystemConfig...');
        const config = await SystemConfig.findOne({ key: 'cj_access_token' });
        log(`Current Cached Token: ${config ? 'FOUND' : 'NOT FOUND'}`);
        if (config) {
            log(`Expiry: ${config.value.expiry}`);
            log(`Token (starts with): ${config.value.token?.substring(0, 10)}...`);
        } else {
            log('No token text found, API will trigger fetch.');
        }

        log('3. Calling CJ Search API (simulating route)...');
        // This will internally call getAccessToken -> check DB -> fetch API -> save DB
        const result = await searchCJProducts('shirt', 1, 5);

        log('4. Result received:');
        // log(result); 

        if (result.success) {
            log('✅ TEST PASSED');
            log(`Found ${result.products?.length} products`);
        } else {
            log('❌ TEST FAILED');
            log(result.error);
        }

    } catch (error: any) {
        log('❌ FATAL ERROR CAUGHT:');
        log(error.message);
        log(error.stack);
    } finally {
        process.exit(0);
    }
}

run();
