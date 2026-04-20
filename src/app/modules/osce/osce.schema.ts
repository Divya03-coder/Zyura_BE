import { Schema, model } from "mongoose";
import { T_Osce } from "./osce.interface";

const taskSchema = new Schema({
    taskName: { type: String, required: true },
    checklistItem: { type: [String], required: true }
}, { _id: false, versionKey: false });

const osce_schema = new Schema<T_Osce>(
    {
        name: { type: String, required: true},
        description: { type: String, required: true },
        scenario: { type: String, required: true },
        timeLimit: { type: String, required: true },
        candidateInstruction: { type: String, required: true },
        patientInstruction: { type: String, required: true },

        tasks: [taskSchema],

        tutorial: { type: [String], required: true },

        learningResource: {
            resourceTitle: { type: String, required: true },
            resourceUrl: { type: String, required: true }
        },

        subject: { type: String, required: true },
        system: { type: String, required: true },
        topic: { type: String, required: true },
        subtopic: { type: String },
        contentFor: { type: String, enum: ["student", "professional"], required: true },
        profileType: { type: String, required: true },
        viewCount: { type: Number, required: false, default: 0 },
    },
    { timestamps: true, versionKey: false }
);

export const osce_model = model("osce", osce_schema);
