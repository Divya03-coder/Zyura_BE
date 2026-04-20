import { Types } from "mongoose";

export type TAdmin = {
    accountId: Types.ObjectId;
    firstName: string;
    lastName: string;
    profile_photo?: string;
}