import { Schema, model } from "mongoose";
import { T_Analytics } from "./analytics.interface";

const analytics_schema = new Schema<T_Analytics>({});
const daily_ai_request_schema = new Schema(
    { count: { type: Number, default: 0 }, date: { type: String, unique: true } },
    { timestamps: true, versionKey: false }
);

export const analytics_model = model("analytics", analytics_schema);
export const daily_ai_request_model = model("daily_ai_request", daily_ai_request_schema);