import mongoose, { Schema, models } from "mongoose";

const EventSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

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

    type: {
      type: String,
      enum: [
        "page_load",
        "click",
        "route_change",
        "console_error",
        "network_fail",
        "input",
      ],
      required: true,
    },

    url: {
      type: String,
      default: "",
    },

    timestamp: {
      type: Date,
      required: true,
      index: true,
    },

    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Event = models.Event || mongoose.model("Event", EventSchema);

export default Event;