import { model, Schema } from "mongoose";
import { TFlashCard } from "./flash_card.interface";


export const CardSchema = new Schema(
  {
    flashCardId: { type: String, required: true },
    frontText: { type: String, required: true },
    image: { type: String },
    backText: { type: String, required: true },
    explanation: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Basic", "Intermediate", "Advance"],
      required: true
    }
  }, { versionKey: false, timestamps: false, _id: false }
)

const FlashCardSchema = new Schema<TFlashCard>(
  {
    title: { type: String, required: true},
    subject: { type: String, required: true },
    system: { type: String, required: true },
    topic: { type: String, required: true },
    subtopic: { type: String },
    contentFor: { type: String, enum: ["student", "professional"], required: true },
    profileType: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    flashCards: [CardSchema],
    viewCount: { type: Number, required: false, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const FlashcardModel = model<TFlashCard>("flash_card", FlashCardSchema);
