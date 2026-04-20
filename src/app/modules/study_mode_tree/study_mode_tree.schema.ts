import { Schema, model } from "mongoose";
import { T_ContentManagementAdmin } from "./study_mode_tree.interface";



const TopicSchema = new Schema({
    topicName: { type: String, required: true },
    subTopics: { type: [String], default: [] },
}, { _id: false });

const SystemSchema = new Schema({
    name: { type: String, required: true },
    topics: { type: [TopicSchema], default: [] },
}, { _id: false });

const content_management_admin_schema = new Schema<T_ContentManagementAdmin>({
    subjectName: { type: String, required: true },
    systems: { type: [SystemSchema], default: [] },
    contentFor: { type: String, required: true },
    profileType: { type: String, required: true },
},
    {
        timestamps: true,
        versionKey: false
    });

export const content_management_admin_model = model("content_management_admin", content_management_admin_schema);
