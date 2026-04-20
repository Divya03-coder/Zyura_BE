import { Schema, model } from "mongoose";
import { T_Event_Enrolled, T_Events } from "./events.interface";

const events_schema = new Schema<T_Events>(
  {
    eventTitle: { type: String },
    eventType: { type: String },
    eventFormat: { type: String },
    category: { type: String },
    description: { type: String },
    eventData: { type: String },
    startTime: { type: String },
    eventDuration: { type: String },
    instructor: { type: String },
    eventPrice: { type: Number, default: null },
    meetingDetails: { type: String },
    status: {
      type: String,
      enum: ["On-Going", "Completed", "Up-Coming"],
      default: "Up-Coming",
    },
    totalRegistrations: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const eventEnrolledSchema = new Schema<T_Event_Enrolled>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "events", required: false },
    registeredBy: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: false,
    },

    paymentId: { type: String, required: false },
    sessionId: { type: String, required: false },
    successIndicator: { type: String, required: false },
    transactionId: { type: String, required: false },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);
export const eventEnrolledModel = model("event_enrolled", eventEnrolledSchema);
export const events_model = model("events", events_schema);
