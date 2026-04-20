import { Types } from "mongoose";
import { TProfileType } from "../../types/common";


type TResourceTopic = "Residency Road maps" | "CV Template" | "Personal Statement" | "Research" | "Interview preparation"
export type TCareerResource = {
    uploadedBy: Types.ObjectId;
    profileType: TProfileType;
    resourceName: string;
    shortDescription: string;
    totalDownloads: number;
    resourceLink: string;
    topic: TResourceTopic[]
}