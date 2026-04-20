import { Schema, model } from "mongoose";
import { T_Faq } from "./faq.interface";

const faq_schema = new Schema<T_Faq>({
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, { timestamps: true, versionKey: false });

export const faq_model = model("faq", faq_schema);
