
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const SystemConfigSchema = new mongoose.Schema({ key: String, value: mongoose.Schema.Types.Mixed });
const SystemConfig = mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);

const CJ_API_URL = process.env.CJ_API_URL || 'https://developers.cjdropshipping.com/api2.0/v1';
const CJ_API_KEY = process.env.CJ_API_KEY;

async function run() {
    try {
        console.log('Seeding Token...');
        await mongoose.connect(process.env.MONGODB_URI!);

        const authRes = await axios.post(`${CJ_API_URL}/authentication/getAccessToken`, { apiKey: CJ_API_KEY });
        if (authRes.data?.code === 200 && authRes.data?.data?.accessToken) {
            const token = authRes.data.data.accessToken;
            // Save to DB
            await SystemConfig.findOneAndUpdate(
                { key: 'cj_access_token' },
                {
                    value: { token: token, expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
                    description: 'CJ Dropshipping API Access Token'
                },
                { upsert: true, new: true }
            );
            console.log('✅ Token Saved.');
        } else {
            console.log('❌ Failed to get token:', authRes.data);
        }

    } catch (e: any) {
        console.error(e.message);
    } finally {
        process.exit(0);
    }
}
run();
