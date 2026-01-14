
import mongoose from 'mongoose';

const SystemConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Can store string, object, array, etc.
        required: true,
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Check if model already exists to prevent overwrite error in dev
const SystemConfig = mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);

export { SystemConfig };
