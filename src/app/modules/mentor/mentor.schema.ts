import { Schema, model } from "mongoose";
import { T_Mentor } from "./mentor.interface";


const availability_schema = new Schema({
    day: { type: String },
    time: { type: [String] }
}, { _id: false, timestamps: false, versionKey: false })

const bankInformation_schema = new Schema({
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    routingNumber: { type: String }, 
    accountType: { type: String }
}, { _id: false, timestamps: false, versionKey: false })

const mentor_schema = new Schema<T_Mentor>({
    accountId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    currentRole: { type: String },
    hospitalOrInstitute: { type: String },
    specialty: { type: String },
    professionalExperience: { type: Number },
    postgraduateDegree: { type: String },
    country: { type: String },
    isConditionAccepted: { type: Boolean },
    profileVerification: { type: String, default: "PENDING" },
    // file information
    profile_photo: { type: String },
    degree: { type: String },
    identity_card: { type: String },
    certificate: { type: String },
    // other information
    bio: { type: String },
    skills: { type: [String] },
    languages: { type: [String] },
    hourlyRate: { type: Number },
    currency: { type: String },
    availability: [availability_schema],
    bankInformation: bankInformation_schema
}, {
    versionKey: false,
    timestamps: true
});

export const mentor_model = model("mentor_profile", mentor_schema);
