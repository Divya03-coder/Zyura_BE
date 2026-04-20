import mongoose from "mongoose";
import { TMcqBank } from "./mcq_bank.interface";

const optionSchema = new mongoose.Schema(
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

export const mcqSchema = new mongoose.Schema(
  {
    mcqId: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ["Basic", "Intermediate", "Advance"],
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

const McqBankSchema = new mongoose.Schema<TMcqBank>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    system: { type: String, required: true },
    topic: { type: String, required: true },
    contentFor: {
      type: String,
      enum: ["student", "professional"],
      required: true,
    },
    profileType: { type: String, required: true },
    subtopic: { type: String },
    uploadedBy: { type: String, required: false },
    mcqs: { type: [mcqSchema], required: true },
    viewCount: { type: Number, required: false, default: 0 },
  },
  { timestamps: true, versionKey: false }
);
export const McqBankModel = mongoose.model<TMcqBank>("mcq_bank", McqBankSchema);
