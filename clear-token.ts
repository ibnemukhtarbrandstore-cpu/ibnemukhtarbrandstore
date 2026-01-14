
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const SystemConfigSchema = new mongoose.Schema({
    key: String,
    value: mongoose.Schema.Types.Mixed
});
const SystemConfig = mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);

async function clearToken() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');
        const res = await SystemConfig.deleteOne({ key: 'cj_access_token' });
        console.log('Delete Result:', res);
        console.log('✅ Cleared cached token.');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
clearToken();
