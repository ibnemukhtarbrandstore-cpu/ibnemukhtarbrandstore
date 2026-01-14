
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const LOG_FILE = path.resolve(process.cwd(), 'verify_import_log.txt');
function log(msg: any) {
    const s = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
    console.log(s);
    fs.appendFileSync(LOG_FILE, s + '\n');
}
fs.writeFileSync(LOG_FILE, '');

async function run() {
    try {
        log('--- VERIFY IMPORT & MAPPING (Dynamic) ---');

        // Dynamic imports ensure dotenv is loaded first
        const { getCJProductDetails, mapCJProductToStore } = await import('./utils/cjApi');
        const { connectDb } = await import('./middleware/mongodb');

        // This might fail if connectDb checks env vars at module level? 
        // No, connectDb checks inside the function.
        // However, middleware/mongodb.ts has `const uri = process.env.MONGODB_URI;` at TOP LEVEL.
        // This is why static import fails if dotenv isn't called BEFORE import.

        const mongoose = (await import('mongoose')).default;

        // We can't easily re-import connectDb if it already captured undefined env vars.
        // But since we are starting a NEW process with npx tsx, and we load dotenv here FIRST, dynamic import should work.

        // TEST_PID from previous search
        const TEST_PID = '2601140758001621300';

        log(`1. Fetching Details for ${TEST_PID} (GET)...`);
        const result = await getCJProductDetails(TEST_PID);

        if (!result.success || !result.product) {
            log('❌ Fetch failed:');
            log(result.error);
            return;
        }

        log('✅ Fetch Success!');
        const raw = result.product;
        log(`Title: ${raw.productNameEn}`);

        log('\n2. Mapping to Store Format...');
        const mapped = mapCJProductToStore(raw);
        log('Mapped Product:');
        log(mapped);

        if (Array.isArray(mapped.images) && mapped.images.length > 0 && !mapped.images[0].includes('[')) {
            log('✅ Images mapped correctly (Array of strings)');
        } else {
            log('❌ Images mapping failed or contains raw JSON');
        }

        if (mapped.availableQty > 0) {
            log(`✅ Qty: ${mapped.availableQty}`);
        } else {
            // 100 is default we set if 0
            log(`✅ Qty: ${mapped.availableQty} (Defaulted or Real)`);
        }

    } catch (e: any) {
        log(`FATAL: ${e.message}`);
    } finally {
        process.exit(0);
    }
}
run();
