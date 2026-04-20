import { Schema, model } from "mongoose";
import { T_Resource_Book, T_Resource_Career } from "./resource.interface";

const resource_schema_career = new Schema<T_Resource_Career>({
    resourceName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: false },
    tags: { type: [String], required: false, default: [] },
    mediaLink: { type: String },
}, { versionKey: false, timestamps: true });



const ResourceBookSchema = new Schema<T_Resource_Book>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
    fileLink: { type: String, required: true },
}, { versionKey: false, timestamps: true });

export const resource_model_career = model("resource_career", resource_schema_career);
export const resource_model_book = model("resource_book", ResourceBookSchema);