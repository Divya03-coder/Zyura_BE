import { Types } from "mongoose";

export type TProfessional = {
    accountId: Types.ObjectId;
    firstName: string;
    lastName: string;
    professionName: string;
    profile_photo: string;
    institution: string;
    country: string;
    post_graduate: string;
    experience: string;
    bio: string;
    point?: number
}