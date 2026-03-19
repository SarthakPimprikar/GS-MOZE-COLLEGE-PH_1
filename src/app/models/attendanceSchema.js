import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    topic: {
        type: String,
    },
    attendanceRecords: [
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
                required: true
            },
            isPresent: {
                type: Boolean,
                required: true,
                default: false
            },
        },
    ],
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    division: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
}, { timestamps: true });


delete mongoose.models.attendance;
const attendance = mongoose.models.attendance || mongoose.model('attendance', attendanceSchema);

export default attendance;