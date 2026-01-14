
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CJ_API_URL = process.env.CJ_API_URL || 'https://developers.cjdropshipping.com/api2.0/v1';
const CJ_API_KEY = process.env.CJ_API_KEY;

const LOG_FILE = path.resolve(process.cwd(), 'debug_product_log_v2.txt');
function log(msg: any) {
    const s = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
    console.log(s);
    fs.appendFileSync(LOG_FILE, s + '\n');
}
fs.writeFileSync(LOG_FILE, '');

// Minimal Schema to read token
const SystemConfigSchema = new mongoose.Schema({ key: String, value: mongoose.Schema.Types.Mixed });
const SystemConfig = mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);

async function run() {
    try {
        log('--- PRODUCT DETAIL DEBUG ---');
        await mongoose.connect(process.env.MONGODB_URI!);

        // 1. Get Token
        const config = await SystemConfig.findOne({ key: 'cj_access_token' });
        if (!config || !config.value || !config.value.token) {
            throw new Error('No token found in DB. Run the search test first or fix-and-verify.');
        }
        const token = config.value.token;
        log(`Token: ${token.substring(0, 15)}...`);

        // 2. Search for a product to get an ID
        log('\n2. Searching for "shirt" to get a PID...');
        const searchRes = await axios.get(`${CJ_API_URL}/product/list`, {
            params: { productNameEn: 'shirt', pageNum: 1, pageSize: 1 },
            headers: { 'CJ-Access-Token': token, 'Authorization': `Bearer ${token}` }
        });

        if (!searchRes.data.data?.list?.length) {
            throw new Error('Search returned no products.');
        }

        const pid = searchRes.data.data.list[0].pid;
        log(`Found PID: ${pid}`);

        // 3. Get Details (Testing GET vs POST)
        log(`\n3. Fetching Details for ${pid}...`);

        // TRY GET
        try {
            log('Attempting GET /product/query...');
            const getRes = await axios.get(`${CJ_API_URL}/product/query`, {
                params: { pid: pid },
                headers: { 'CJ-Access-Token': token, 'Authorization': `Bearer ${token}` }
            });
            log(`GET Status: ${getRes.status}`);
            log(`GET Response Code: ${getRes.data?.code}`);
            if (getRes.data?.code === 200) {
                log('✅ GET worked!');
                log(JSON.stringify(getRes.data.data, null, 2));

                // Also test POST just to see if it responds "Method Not Supported"
            } else {
                log(`❌ GET failed with API code: ${JSON.stringify(getRes.data)}`);
            }
        } catch (e: any) {
            log(`❌ GET Request Error: ${e.message}`);
        }

        // TRY POST (if GET failed or just to check)
        try {
            log('\nAttempting POST /product/query...');
            const postRes = await axios.post(`${CJ_API_URL}/product/query`,
                { pid: pid },
                { headers: { 'CJ-Access-Token': token, 'Authorization': `Bearer ${token}` } }
            );
            log(`POST Status: ${postRes.status}`);
            log(`POST Response Code: ${postRes.data?.code}`);
            log(`POST Data: ${JSON.stringify(postRes.data, null, 2)}`);
        } catch (e: any) {
            log(`❌ POST Request Error: ${e.message}`);
        }

    } catch (error: any) {
        log(`FATAL: ${error.message}`);
    } finally {
        process.exit(0);
    }
}

run();
