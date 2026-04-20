import { Schema, model } from "mongoose";
import { T_Sessions } from "./sessions.interface";

const sessions_schema = new Schema<T_Sessions>(
  {
    sessionDuration: {
      type: String,
    },
    sessionValue: {
      type: Number,
    },
    sessionStatus: {
      type: String,
      enum: ["UPCOMING", "COMPLETED", "EXPIRED"],
      default: "UPCOMING",
    },
    // student or professional info
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    studentAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },

    // issues
    issue: {
      type: String,
      trim: true,
    },
    mentorAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },

    // time slot
    date: {
      type: String,
    },
    time: {
      type: String,
    },

    // payment info
    paymentId: {
      type: String,
    },
    sessionId: {
      type: String,
    },
    successIndicator: {
      type: String,
    },
    studentSidePaymentStatus: {
      type: String,
    },
    adminToMentorPaymentStatus: {
      type: String,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const sessions_model = model("sessions", sessions_schema);
