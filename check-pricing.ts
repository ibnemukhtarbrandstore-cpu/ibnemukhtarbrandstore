
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading env from:', envPath);
dotenv.config({ path: envPath });

const LOG_FILE = path.resolve(process.cwd(), 'verify_pricing_log.txt');
function log(msg: any) {
    const s = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
    console.log(s);
    try { fs.appendFileSync(LOG_FILE, s + '\n'); } catch (e) { }
}
fs.writeFileSync(LOG_FILE, '');

async function run() {
    try {
        log('--- VERIFY PRICING & VARIANTS (Debug V2) ---');
        log(`Create Env Check: MONGO=${!!process.env.MONGODB_URI}, CJ_KEY=${!!process.env.CJ_API_KEY}`);

        const { getCJProductDetails, mapCJProductToStore } = await import('./utils/cjApi');

        const TEST_PID = '2601140758001621300';

        log(`1. Fetching Details for ${TEST_PID}...`);
        const result = await getCJProductDetails(TEST_PID);
        log('Fetch returned.');

        if (!result.success || !result.product) {
            log('❌ Fetch failed');
            log(result.error);
            return;
        }

        const raw = result.product;
        log(`Raw CJ Price (USD): ${raw.sellPrice}`);

        log('\n2. Mapping to Store (PKR)...');
        const mapped = mapCJProductToStore(raw);

        log(`Title: ${mapped.title}`);
        log(`Color: ${mapped.color}`);
        log(`Currency: ${mapped.currency}`);
        log(`Final Price: ${mapped.price}`);

        log(`\n EXPECTED: ~ ${raw.sellPrice} * 2.5 * 280 = ${Math.ceil(raw.sellPrice * 2.5 * 280)}`);

        if (mapped.price > 1000) {
            log('✅ Price is in PKR range.');
        } else {
            log('❌ Price is TOO LOW (USD level).');
        }

        if (mapped.sizeVariants && mapped.sizeVariants.length > 0) {
            log(`✅ Size Variants: ${mapped.sizeVariants.length}`);
            mapped.sizeVariants.slice(0, 3).forEach((v: any) => {
                log(` - Size: ${v.size} | Stock: ${v.stock} | SKU: ${v.sku}`);
            });
        } else {
            log('⚠️ No size variants mapped.');
        }

    } catch (e: any) {
        log(`FATAL: ${e.message}`);
        log(e.stack);
    } finally {
        process.exit(0);
    }
}
run();
