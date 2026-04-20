import { Schema, model } from "mongoose";
import { T_ProfessionalProfileTypeConst, T_StudentProfileTypeConst } from "./profile_type_const.interface";

const student_profile_type_const_schema = new Schema<T_StudentProfileTypeConst>({
    typeName: { type: String, required: true, unique: true, index: true },
    totalContent: { type: Number, required: true, default: 0 },
    totalStudent: { type: Number, required: true, default: 0 }
}, { versionKey: false, timestamps: true });

const professional_profile_type_const_schema = new Schema<T_ProfessionalProfileTypeConst>({
    typeName: { type: String, required: true, unique: true, index: true },
    totalContent: { type: Number, required: true, default: 0 },
    totalStudent: { type: Number, required: true, default: 0 }
}, { versionKey: false, timestamps: true });

export const student_profile_type_const_model = model("student_profile_type_const", student_profile_type_const_schema);
export const professional_profile_type_const_model = model("professional_profile_type_const", professional_profile_type_const_schema);
