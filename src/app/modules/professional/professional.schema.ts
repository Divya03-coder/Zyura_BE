import mongoose, { Schema } from "mongoose";
import { TProfessional } from "./professional.interface";

const ProfessionalSchema = new Schema<TProfessional>(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "account", required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    professionName: { type: String, required: false },
    profile_photo: { type: String, required: false },
    institution: { type: String, required: false },
    country: { type: String, required: false },
    post_graduate: { type: String, required: false },
    experience: { type: String, required: false },
    bio: { type: String, required: false },
    point: { type: Number, required: false, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

export const ProfessionalModel = mongoose.model<TProfessional>(
  "professional_profile",
  ProfessionalSchema
);
