import { Schema, model } from "mongoose";
import { T_Group } from "./group.interface";

const group_schema = new Schema<T_Group>(
  {
    groupName: {
      type: String,
      required: false,
      trim: true,
    },
    groupLogo: {
      type: String,
      required: false,
    },
    groupDescription: {
      type: String,
      required: false,
      trim: true,
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: false,
    },
    groupMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "account",
        required: false,
      },
    ],
    groupType: {
      type: String,
      enum: ["public", "private"],
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const group_model = model("group", group_schema);
