import { model, Schema } from "mongoose";
import { TAdmin } from "./admin.interface";

const adminSchema = new Schema<TAdmin>({
    accountId: { type: Schema.Types.ObjectId, required: true, ref: "account" },
    firstName: { type: String },
    lastName: { type: String },
    profile_photo: { type: String, required: false }
})

export const Admin_Model = model<TAdmin>("admin_profile", adminSchema);