import { Schema, model } from "mongoose";
import { T_Exam_Professional, T_Exam_Student } from "./exam.interface";
// helper schemas
const optionSchema = new Schema(
    {
        option: {
            type: String,
            enum: ["A", "B", "C", "D", "E", "F"],
            required: true,
        },
        optionText: {
            type: String || Number,
            required: true,
        },
        explanation: {
            type: String || Number,
        },
    },
    { versionKey: false, timestamps: false, _id: false }
);

const mcqSchema = new Schema(
    {
        mcqId: {
            type: String,
        },
        question: {
            type: String,
        },
        imageDescription: {
            type: String,
        },
        options: {
            type: [optionSchema],
            validate: {
                validator: (v: any[]) => v.length >= 2,
                message: "Each MCQ must have at least two options.",
            },
        },
        correctOption: {
            type: String,
            enum: ["A", "B", "C", "D", "E", "F"],
        },
    },
    { versionKey: false, timestamps: false, _id: false }
);

// main schema's


// for student
const exam_schema_student = new Schema<T_Exam_Student>({
    profileType: { type: String, required: true },
    examName: { type: String, required: true },
    subject: { type: String, required: true },
    mcqs: { type: [mcqSchema], required: true },
    totalQuestions: { type: Number, required: false },
    totalTime: { type: Number, required: true },
}, { versionKey: false, timestamps: true });


// for professional
const exam_schema_professional = new Schema<T_Exam_Professional>({
    professionName: { type: String, required: true },
    examName: { type: String, required: true },
    mcqs: { type: [mcqSchema], required: true },
    totalQuestions: { type: Number, required: false },
    totalTime: { type: Number, required: true },
}, { versionKey: false, timestamps: true });



export const exam_model_student = model("exam_student", exam_schema_student);
export const exam_model_professional = model("exam_professional", exam_schema_professional);

