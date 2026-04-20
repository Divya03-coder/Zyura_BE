import { Schema, model } from "mongoose";
import { T_GroupMessage } from "./group_message.interface";

const group_message_schema = new Schema<T_GroupMessage>(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "group",
            required: false,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "account",
            required: false,
        },
        message: {
            type: String,
            required: false,
        },
        file: {
            fileType: {
                type: String,
                required: false,
            },
            fileName: {
                type: String,
                required: false,
            },
            fileUrl: {
                type: String,
                required: false,
            },
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "account",
                required: false,
            },
        ],
        reply: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const group_message_model = model("group_message", group_message_schema);
