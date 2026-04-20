import { Schema, model } from "mongoose";
import { CorrectOptionSchema, DiagnosisQuestionSchema, LaboratoryResultSchema, MCQSchema } from "../clinical_case/clinical_case.schema";
import { CardSchema } from "../flash_card/flash_card.schema";
import { mcqSchema } from "../mcq_bank/mcq_bank.schema";
import { T_MyContent_clinicalCase, T_MyContent_flashcard, T_MyContent_mcq, T_MyContent_notes } from "./my_content.interface";

const my_content_flash_card_schema = new Schema<T_MyContent_flashcard>(
    {
        title: { type: String },
        subject: { type: String },
        system: { type: String },
        topic: { type: String },
        subtopic: { type: String },
        flashCards: [CardSchema],
        studentId: { type: String }
    }, { versionKey: false, timestamps: true }
);

// const recommended_content_schema = new Schema({
//     contentType: { type: String },
//     title: { type: String },
//     contentId: { type: String }
// }, { _id: false, timestamps: false, versionKey: false })
// tracking api schema
const tracking_schema = new Schema({
    totalMcqCount: { type: Number, default: 0 },
    totalAttemptCount: { type: Number, default: 0 },
    correctMcqCount: { type: Number, default: 0 },
    wrongMcqCount: { type: Number, default: 0 },
    timeTaken: { type: String, default: "0" },
    progress: { type: Number, default: 0 },
    correctPercentage: { type: Number, default: 0 },
    wrongPercentage: { type: Number, default: 0 },
    unattemptedPercentage: { type: Number, default: 0 },
    recommendedContent: { type: Schema.Types.Mixed }
}, { _id: false, timestamps: false, versionKey: false })

const my_content_mcq_schema = new Schema<T_MyContent_mcq>(
    {
        title: { type: String },
        subject: { type: String },
        system: { type: String },
        topic: { type: String },
        subtopic: { type: String },
        mcqs: { type: [mcqSchema] },
        studentId: { type: String },
        tracking: tracking_schema,
        isCompleted: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false }
);
const my_content_clinicalCase_schema = new Schema<T_MyContent_clinicalCase>(
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
        tracking: tracking_schema,

        subject: { type: String, required: true },
        system: { type: String, required: true },
        topic: { type: String, required: true },
        subtopic: { type: String },
        studentId: { type: String, required: true }

    },
    { timestamps: true, versionKey: false }
);


const my_content_notes_schema = new Schema<T_MyContent_notes>(
    {
        title: { type: String },
        subject: { type: String },
        system: { type: String },
        topic: { type: String },
        subtopic: { type: String },
        note: { type: String },
        studentId: { type: String }
    },
    { timestamps: true, versionKey: false }
);

export const my_content_flashcard_model = model("my_content_flash_card", my_content_flash_card_schema);
export const my_content_mcq_bank_model = model("my_content_mcq_bank", my_content_mcq_schema);
export const my_content_clinicalCase_model = model("my_content_clinical_case", my_content_clinicalCase_schema);
export const my_content_notes_model = model("my_content_notes", my_content_notes_schema);
