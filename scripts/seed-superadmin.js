/**
 * Seed script to create a superadmin user
 * Run with: node scripts/seed-superadmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Manually read .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length) {
        envVars[key.trim()] = values.join('=').trim();
    }
});
const MONGODB_URI = envVars.MONGODB_URI;

// User schema definition (inline to avoid ES module issues)
const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        password: { type: String, required: true, minlength: 8 },
        role: {
            type: String,
            enum: ["admin", "superadmin", "staff", "teacher", "hod", "hr"],
            default: "staff",
        },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        lastLogin: Date,
        sessionToken: String,
        staffId: { type: String, unique: true, sparse: true },
        designation: String,
        department: String,
    },
    { timestamps: true }
);

async function seedSuperAdmin() {
    try {
        // Connect to MongoDB
        const mongoUri = MONGODB_URI;

        if (!mongoUri) {
            console.error('❌ MongoDB URI not found in environment variables');
            console.log('Please ensure MONGODB_URI or MONGO_URI is set in .env.local');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Get or create the User model
        const User = mongoose.models.user || mongoose.model('user', userSchema);

        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });

        if (existingSuperAdmin) {
            console.log('ℹ️  Superadmin already exists:');
            console.log(`   Email: ${existingSuperAdmin.email}`);
            console.log('   (Password unchanged)');
        } else {
            // Create superadmin credentials
            const superAdminData = {
                fullName: 'Super Admin',
                email: 'superadmin@techedu.com',
                phone: '9999999999',
                password: await bcrypt.hash('SuperAdmin@123', 10),
                role: 'superadmin',
                isVerified: true,
                isActive: true,
            };

            const newSuperAdmin = await User.create(superAdminData);

            console.log('✅ Superadmin created successfully!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 Email:    superadmin@techedu.com');
            console.log('🔐 Password: SuperAdmin@123');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('⚠️  Please change this password after first login!');
        }

        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding superadmin:', error.message);
        process.exit(1);
    }
}

seedSuperAdmin();
