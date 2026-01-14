
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const LOG_FILE = path.resolve(process.cwd(), 'debug_fix_log.txt');
function log(msg: any) {
    const s = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
    console.log(s);
    fs.appendFileSync(LOG_FILE, s + '\n');
}
fs.writeFileSync(LOG_FILE, '');

// Schema
const SystemConfigSchema = new mongoose.Schema({
    key: String,
    value: mongoose.Schema.Types.Mixed
});
const SystemConfig = mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);

const CJ_API_URL = process.env.CJ_API_URL || 'https://developers.cjdropshipping.com/api2.0/v1';
const CJ_API_KEY = process.env.CJ_API_KEY;

async function run() {
    try {
        log('--- DIAGNOSTIC RUN ---');
        log(`API URL: ${CJ_API_URL}`);
        log(`API Key: ${CJ_API_KEY?.substring(0, 10)}...`);

        if (!process.env.MONGODB_URI) throw new Error('No Mongo URI');
        await mongoose.connect(process.env.MONGODB_URI);
        log('✅ DB Connected');

        // 1. Clear Cache
        log('1. Clearing Cache...');
        await SystemConfig.deleteOne({ key: 'cj_access_token' });
        log('Cache cleared.');

        // 2. Fetch Token Manually
        log('2. Fetching Token Raw...');
        const authUrl = `${CJ_API_URL}/authentication/getAccessToken`;
        log(`POST ${authUrl}`);

        try {
            const authRes = await axios.post(authUrl, { apiKey: CJ_API_KEY });
            log(`Auth Status: ${authRes.status}`);
            log('Auth Data:');
            log(authRes.data);

            if (authRes.data?.code === 200 && authRes.data?.data?.accessToken) {
                const token = authRes.data.data.accessToken;
                log(`✅ Got Token: ${token.substring(0, 20)}...`);

                // 3. Test Search with this token
                log('3. Testing Search with fresh token...');
                const searchUrl = `${CJ_API_URL}/product/list`;
                log(`POST ${searchUrl}`);

                try {
                    const searchRes = await axios.post(searchUrl, {
                        productNameEn: 'shirt',
                        pageNum: 1,
                        pageSize: 1
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'CJ-Access-Token': token,
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    log(`Search Status: ${searchRes.status}`);
                    log('Search Result (Partial):');
                    log(searchRes.data);
                } catch (searchErr: any) {
                    log('❌ Search Failed:');
                    if (searchErr.response) {
                        log(`Status: ${searchErr.response.status}`);
                        log(`Headers: ${JSON.stringify(searchErr.response.headers, null, 2)}`);
                        log(searchErr.response.data);
                    } else {
                        log(searchErr.message);
                    }
                }

            } else {
                log('❌ Failed to get valid token structure.');
            }

        } catch (authErr: any) {
            log('❌ Auth Request Failed:');
            if (authErr.response) {
                log(`Status: ${authErr.response.status}`);
                log(authErr.response.data);
            } else {
                log(authErr.message);
            }
        }

    } catch (e: any) {
        log('FATAL: ' + e.message);
    } finally {
        process.exit(0);
    }
}

run();
