import { Document, Schema } from "mongoose";

export interface ICommonPreference extends Document {
    subject: string;
    systemPreference: string;
    topic: string;
    subTopic: string;
}

export const CommonPreferenceSchema: Schema<ICommonPreference> = new Schema(
    {
        subject: { type: String,},
        systemPreference: { type: String,},
        topic: { type: String,},
        subTopic: { type: String, },
    },
    { timestamps: true, _id: false, versionKey: false }
);
