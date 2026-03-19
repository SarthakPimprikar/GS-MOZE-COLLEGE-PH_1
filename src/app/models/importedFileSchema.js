import mongoose from "mongoose";

const importedFileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    totalRecords: {
      type: Number,
      default: 0,
    },
    importedRecords: {
      type: Number,
      default: 0,
    },
    duplicateRecords: {
      type: Number,
      default: 0,
    },
    errorRecords: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed", "partial"],
      default: "processing",
    },
    importErrors: [{
      row: Number,
      error: String,
      data: mongoose.Schema.Types.Mixed
    }],
    importedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Avoid overwrite issues in dev
delete mongoose.models.importedFile;
const importedFile =
  mongoose.models.importedFile || mongoose.model("importedFile", importedFileSchema);

export default importedFile;
