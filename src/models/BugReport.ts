import mongoose, { Schema, models } from "mongoose";

const BugReportSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    trackingKey: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "low",
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },

    stepsToReproduce: {
      type: [String],
      default: [],
    },

    technicalEvidence: {
      type: [String],
      default: [],
    },

    suggestedFix: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const BugReport =
  models.BugReport || mongoose.model("BugReport", BugReportSchema);

export default BugReport;