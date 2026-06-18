import mongoose, { Schema, models } from "mongoose";

const SessionSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    trackingKey: {
      type: String,
      required: true,
      index: true,
    },

    sessionToken: {
      type: String,
      required: true,
      index: true,
    },

    browser: {
      type: String,
      default: "Unknown",
    },

    os: {
      type: String,
      default: "Unknown",
    },

    device: {
      type: String,
      default: "Desktop",
    },

    screenSize: {
      type: String,
      default: "",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    eventCount: {
      type: Number,
      default: 0,
    },

    hasError: {
      type: Boolean,
      default: false,
    },

    autoSeverity: {
      type: String,
      enum: ["critical", "high", "medium", "low", null],
      default: null,
    },
  },
  { timestamps: true }
);

const Session = models.Session || mongoose.model("Session", SessionSchema);

export default Session;