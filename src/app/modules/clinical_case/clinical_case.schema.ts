import { Schema, model } from "mongoose";
import { TClinicalCase } from "./clinical_case.interface";

export const OptionSchema = new Schema({
    optionName: { type: String, enum: ["A", "B", "C", "D"], required: true },
    optionValue: { type: String, required: true },
    supportingEvidence: { type: [String], default: [] },
    refutingEvidence: { type: [String], default: [] },
}, { _id: false });

export const LaboratoryResultSchema = new Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
}, { _id: false });

export const DiagnosisQuestionSchema = new Schema({
    question: { type: String, required: true },
    diagnosisOptions: { type: [OptionSchema], required: true },
}, { _id: false });

export const CorrectOptionSchema = new Schema({
    optionName: { type: String, enum: ["A", "B", "C", "D"], required: true },
    explanation: { type: String, required: true },
}, { _id: false });

export const MCQOptionSchema = new Schema({
    option: { type: String, enum: ["A", "B", "C", "D", "E", "F"], required: true },
    optionText: { type: String, required: true },
    explanation: { type: String },
}, { _id: false });

export const MCQSchema = new Schema({
    question: { type: String, required: true },
    options: { type: [MCQOptionSchema], required: true },
    correctOption: {
        type: String,
        enum: ["A", "B", "C", "D", "E", "F"],
        required: true,
    },
}, { _id: false });

const ClinicalCaseSchema = new Schema<TClinicalCase>(
    {
        caseTitle: { type: String, required: true },
        patientPresentation: { type: String, required: true },
        historyOfPresentIllness: { type: String, required: true },
        physicalExamination: { type: String, required: true },
        laboratoryResults: { type: [LaboratoryResultSchema], default: [] },
        imaging: { type: String, required: true },

        diagnosisQuestion: { type: DiagnosisQuestionSchema, required: true },
        correctOption: { type: CorrectOptionSchema, required: true },

        difficultyLevel: {
            type: String,
            enum: ["Basic", "Intermediate", "Advance"],
            required: true,
        },

        mcqs: { type: [MCQSchema], default: [] },

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

export const ClinicalCaseModel = model("clinical_case", ClinicalCaseSchema);
