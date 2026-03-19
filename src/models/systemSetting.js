import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema({
  // 1) System Configuration Settings
  systemConfig: {
    allowRegistrations: { type: Boolean, default: true },
    defaultRole: { type: String, enum: ['student', 'faculty', 'admin', 'hr'], default: 'student' },
    collegeName: { type: String, default: 'My College' },
    academicYear: { type: String, default: '2025-2026' },
    language: { type: String, default: 'en' },
  },

  // 2) Role Permissions Settings
  rolePermissions: {
    student: {
      canViewAttendance: { type: Boolean, default: true },
      canDownloadFeeReceipt: { type: Boolean, default: true },
      canRegisterCourses: { type: Boolean, default: true },
    },
    faculty: {
      canTakeAttendance: { type: Boolean, default: true },
      canViewAssignedCourses: { type: Boolean, default: true },
      canViewStudentList: { type: Boolean, default: true },
    },
    admin: {
      canManageUsers: { type: Boolean, default: true },
      canUpdateSettings: { type: Boolean, default: true },
      canViewReports: { type: Boolean, default: true },
    },
    hr: {
      canManagePayroll: { type: Boolean, default: true },
      canGeneratePayslip: { type: Boolean, default: true },
    }
  },

  // 3) Financial Settings
  financialSettings: {
    feeInstallments: [
      {
        name: { type: String, required: true }, // e.g., 'First Installment'
        dueDate: { type: Date, required: true },
        amount: { type: Number, required: true }
      }
    ],
    lateFee: {
      enabled: { type: Boolean, default: true },
      perDayAmount: { type: Number, default: 50 }, // ₹50 per day
      gracePeriodDays: { type: Number, default: 5 }
    }
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.SystemSetting || mongoose.model('SystemSetting', systemSettingSchema);
