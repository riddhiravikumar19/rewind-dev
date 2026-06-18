import mongoose, { Schema, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    ownerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    trackingKey: {
      type: String,
      required: true,
      unique: true,
    },

    environment: {
      type: String,
      enum: ["development", "staging", "production"],
      default: "development",
    },

    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Project = models.Project || mongoose.model("Project", ProjectSchema);

export default Project;