import { model, Schema } from "mongoose";
import { TCareerResource } from "./career_resource.interface";

const careerResourceSchema = new Schema<TCareerResource>({
    uploadedBy: { type: Schema.Types.ObjectId, required: true, refPath: "profileType" },
    profileType: {
        type: String,
        required: true,
        enum: ["student_profile", "admin_profile", "mentor_profile"],
    },
    resourceName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    totalDownloads: { type: Number, required: false, default: 0 },
    resourceLink: { type: String, required: true },
    topic: { type: [String], required: true }
}, { versionKey: false, timestamps: true })


export const CareerResourceModel = model<TCareerResource>("career_resource", careerResourceSchema);