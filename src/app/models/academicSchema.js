import mongoose from "mongoose";

const academicSchema = new mongoose.Schema({
  department: {
  type: String,
  required: true,  // e.g. "Computer Science", "Mechanical", etc.
  trim: true
},
  years: [
    {
      year: {
        type: String, // e.g. "1st", "2nd"
        required: true,
      },
      semester: {
        type: String, // e.g. "Sem 1", "Sem 2"
        required: true,
      },
      divisions: [
        {
          name: {
            type: String, // A, B, C
            required: true,
          },
          students: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
            validate: {
              validator: function (arr) {
                return arr.length <= 50;
              },
              message: "A division cannot have more than 50 students.",
            },
          },
          subjects: [
            {
              code: { type: String },
              name: { type: String, required: true }, // e.g. OOPs, CNS
              teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "teacher",
                required: true,
              },
            },
          ],
          timetable: [
            {
              day: { type: String, required: true }, // Monday, Tuesday...
              period: { type: String, required: true }, // Period 1, 2...
              subject: { type: String, required: true },
              teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
              },
              time: {
                start: { type: String }, // "10:00"
                end: { type: String }, // "10:45"
              },
            },
          ],
          exams: [
            {
              type: { type: String, required: true }, // Unit Test, Mid Term, etc.
              subject: { type: String, required: true },
              totalMarks: { type: Number, required: true },
              date: { type: Date, required: true },
              duration: {
                type: Number, // in minutes
                required: false,
                default: 0,
              },
              resultPublished: {
                type: Boolean,
                default: false, // Results are not published by default
              },
              result: [
                {
                  student: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Student",
                    required: true,
                  },
                  marks: {
                    type: Number,
                    default: null,
                  },
                  isAttend: {
                    type: Boolean,
                    default: true,
                  },
                },
              ],
            },
          ],
          attendance: [
            {
              student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // assuming student is stored in 'User' model
              },
              subject: { type: String, required: true },
              date: { type: Date, required: true },
              isPresent: {
                type: Boolean,
                required: true,
              },
              recordedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // recorded by teacher
                required: true,
              },
            },
          ],
        },
      ],
    },
  ],
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
});

delete mongoose.models.academic;

const academic =
  mongoose.models.academic || mongoose.model("academic", academicSchema);

export default academic;