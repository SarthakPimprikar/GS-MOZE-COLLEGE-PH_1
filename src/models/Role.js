import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        permissions: [{
            type: String,
            // Format: module.action, e.g., 'user.create', 'finance.approve'
        }],
        isSystem: {
            type: Boolean,
            default: false,
            // System roles (like Super Admin) cannot be deleted or have critical permissions removed
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Role || mongoose.model('Role', roleSchema);
