/**
 * Seed script to create academic records with proper year structure
 * Run with: node scripts/seed-academic-data.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env file
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

// Academic schema definition (inline to avoid ES module issues)
const academicSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
        trim: true
    },
    years: [{
        year: {
            type: String, // e.g. "1st", "2nd", "3rd", "4th"
            required: true,
        },
        semester: {
            type: String, // e.g. "Sem 1", "Sem 2"
            required: true,
        },
        divisions: [{
            name: {
                type: String, // A, B, C
                required: true,
            },
            students: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "Student",
                default: []
            },
            subjects: [{
                code: { type: String },
                name: { type: String, required: true },
                teacher: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "teacher",
                    required: true,
                },
            }],
            timetable: [{
                day: { type: String, required: true },
                period: { type: String, required: true },
                subject: { type: String, required: true },
                teacher: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                time: {
                    start: { type: String },
                    end: { type: String },
                },
            }],
            exams: [{
                type: { type: String, required: true },
                subject: { type: String, required: true },
                totalMarks: { type: Number, required: true },
                date: { type: Date, required: true },
                duration: { type: Number, default: 0 },
                resultPublished: { type: Boolean, default: false },
                result: [{
                    student: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Student",
                        required: true,
                    },
                    marks: { type: Number, default: null },
                    isAttend: { type: Boolean, default: true },
                }],
            }],
            attendance: [{
                student: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                subject: { type: String, required: true },
                date: { type: Date, required: true },
                isPresent: { type: Boolean, required: true },
                recordedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
            }],
        }],
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    programType: {
        type: String,
        required: true,
    },
    description: { type: String },
}, { timestamps: true });

async function seedAcademicData() {
    try {
        // Connect to MongoDB
        if (!MONGODB_URI) {
            console.error('❌ MongoDB URI not found in environment variables');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get or create the Academic model
        const Academic = mongoose.models.academic || mongoose.model('academic', academicSchema);

        // Clear existing academic data to avoid conflicts
        await Academic.deleteMany({});
        console.log('🗑️  Cleared existing academic data');

        // Sample academic data with multiple years
        const academicData = [
            {
                department: "Mechanical Engineering",
                programType: "Diploma",
                years: [
                    {
                        year: "1st",
                        semester: "Sem 1",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "2nd",
                        semester: "Sem 3",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "3rd",
                        semester: "Sem 5",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    }
                ],
                isActive: true,
                description: "Diploma in Mechanical Engineering program"
            },
            {
                department: "Computer Science",
                programType: "UG",
                years: [
                    {
                        year: "1st",
                        semester: "Sem 1",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "C", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "2nd",
                        semester: "Sem 3",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "C", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "3rd",
                        semester: "Sem 5",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "C", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "4th",
                        semester: "Sem 7",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "C", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    }
                ],
                isActive: true,
                description: "Bachelor of Engineering in Computer Science"
            },
            {
                department: "Electrical Engineering",
                programType: "Diploma",
                years: [
                    {
                        year: "1st",
                        semester: "Sem 1",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "2nd",
                        semester: "Sem 3",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "3rd",
                        semester: "Sem 5",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    }
                ],
                isActive: true,
                description: "Diploma in Electrical Engineering program"
            },
            {
                department: "Civil Engineering",
                programType: "UG",
                years: [
                    {
                        year: "1st",
                        semester: "Sem 1",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "2nd",
                        semester: "Sem 3",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "3rd",
                        semester: "Sem 5",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    },
                    {
                        year: "4th",
                        semester: "Sem 7",
                        divisions: [
                            { name: "A", students: [], subjects: [], timetable: [], exams: [], attendance: [] },
                            { name: "B", students: [], subjects: [], timetable: [], exams: [], attendance: [] }
                        ]
                    }
                ],
                isActive: true,
                description: "Bachelor of Engineering in Civil Engineering"
            }
        ];

        // Create academic records
        console.log('📝 Creating academic records...');
        const createdRecords = [];

        for (const data of academicData) {
            const academic = new Academic(data);
            const savedAcademic = await academic.save();
            createdRecords.push(savedAcademic);
            console.log(`✅ Created academic record for ${data.department} - ${data.programType}`);
            console.log(`   Years: ${data.years.map(y => y.year).join(', ')}`);
        }

        console.log('\n🎉 Academic data seeding completed!');
        console.log('📊 Summary:');
        console.log(`   - Academic programs created: ${createdRecords.length}`);
        console.log(`   - Total years across all programs: ${createdRecords.reduce((sum, record) => sum + record.years.length, 0)}`);
        console.log(`   - Available years for dropdown: 1st, 2nd, 3rd, 4th`);
        
        console.log('\n🔍 Fee structure dropdown should now show:');
        console.log('   - Program Types: Diploma, UG');
        console.log('   - Departments: Mechanical Engineering, Computer Science, Electrical Engineering, Civil Engineering');
        console.log('   - Years: 1st, 2nd, 3rd, 4th');

        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding academic data:', error.message);
        process.exit(1);
    }
}

seedAcademicData();
