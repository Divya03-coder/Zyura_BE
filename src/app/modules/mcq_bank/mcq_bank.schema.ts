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
      type: String,
      required: true,
    },
    explanation: {
      type: String,
    },
  },
  { versionKey: false, timestamps: false, _id: false },
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
  { versionKey: false, timestamps: false, _id: false },
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
  { timestamps: true, versionKey: false },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// These make the duplicate-check queries go from full-collection scan (~18s)
// to indexed lookup (sub-10ms) when filtering by contentFor + profileType.

// Used by check_duplicate_question bankFilters
McqBankSchema.index({ contentFor: 1, profileType: 1 });

// Used by get_all_mcq_banks + get_all_mcq_banks_public_from_db
McqBankSchema.index({ subject: 1, system: 1, topic: 1 });

// Used by title search ($regex on indexed field is faster on large collections)
McqBankSchema.index({ title: 1 });

export const McqBankModel = mongoose.model<TMcqBank>("mcq_bank", McqBankSchema);