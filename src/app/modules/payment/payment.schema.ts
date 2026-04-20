import { Schema, model } from "mongoose";
import { T_Payment } from "./payment.interface";

const payment_schema = new Schema<T_Payment>(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "account", required: true },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "pricing_plan",
      required: true,
    },
    paymentId: { type: String, required: true },
    sessionId: { type: String, required: true },
    successIndicator: { type: String, required: true },
    transactionId: { type: String, required: false },
    amount: { type: Number, required: false },
    currency: { type: String, required: false },
    checkoutMode: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      required: false,
      default: "PENDING",
    },
  },
  { timestamps: true, versionKey: false }
);

export const payment_model = model("payment", payment_schema);
