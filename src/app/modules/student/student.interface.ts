import { Types } from "mongoose"
import { TCommonPreference } from "../../types/common"

export type TStudent = {
    accountId: Types.ObjectId,
    firstName?: string,
    lastName?: string,
    studentType?: string,
    phone?: string,
    country?: string,
    university?: string,
    preparingFor?: {
        examName: string,
        description: string
    }[],
    bio?: string,
    year_of_study?: string,
    profile_photo?: string,
    point?: number,
    badges?: Types.ObjectId[],
    connectedMentor?: Types.ObjectId[],
    preference?: TCommonPreference
}

