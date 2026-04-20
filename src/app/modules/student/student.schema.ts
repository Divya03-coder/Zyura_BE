import { model, Schema } from 'mongoose';
import { CommonPreferenceSchema } from '../../common/common.schema';
import { TStudent } from './student.interface';

const prepFor = new Schema({
    examName: { type: String, required: false },
    description: { type: String, required: false }
}, { _id: false, versionKey: false, timestamps: false });

const studentSchema = new Schema<TStudent>({
    accountId: { type: Schema.Types.ObjectId, required: true, ref: "account" },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    studentType: { type: String, required: false },
    phone: { type: String, required: false },
    country: { type: String, required: false },
    university: { type: String, required: false },
    preparingFor: { type: [prepFor], required: false },
    bio: { type: String, required: false },
    year_of_study: { type: String, required: false },
    profile_photo: { type: String, required: false },
    point: { type: Number, required: false, default: 0 },
    badges: [{ type: Schema.Types.ObjectId, ref: 'badge', required: false }],
    connectedMentor: [{ type: Schema.Types.ObjectId, ref: 'mentor', required: false }],
    preference: { type: CommonPreferenceSchema, required: false }
}, { timestamps: true, versionKey: false });

export const Student_Model = model<TStudent>('student_profile', studentSchema);