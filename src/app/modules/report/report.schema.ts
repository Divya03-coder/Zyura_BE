import { Schema, model } from "mongoose";
import { T_Report } from "./report.interface";

const report_schema = new Schema<T_Report>({
    accountId: { type: String, required: true, ref: "account" },
    name: { type: String, required: true },
    profile_photo: { type: String, required: false },
    report: {
        questionBankId: { type: String, required: true },
        mcqId: { type: String, required: true },
        text: { type: String, required: true },
    },
    status: { type: String, enum: ["IN_REVIEW", "RESOLVED", "REJECTED"], default: "IN_REVIEW" },
    note:{type:String}
}, { versionKey: false, timestamps: true });

export const report_model = model("report", report_schema);
