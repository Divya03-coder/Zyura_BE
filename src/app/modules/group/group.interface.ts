import { Types } from "mongoose";

export type T_Group = {
    groupName: string;
    groupLogo: string;
    groupDescription: string;
    groupAdmin: Types.ObjectId;
    groupMembers: Types.ObjectId[];
    groupType: "public" | "private";
}
