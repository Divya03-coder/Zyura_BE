import { Types } from "mongoose";
import { TProfileType } from "../../types/common";

export type TStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type TAccount = {
  email: string;
  role: "ADMIN" | "STUDENT" | "MENTOR" | "PROFESSIONAL";
  password: string;
  profile_id: Types.ObjectId;
  isDeleted?: boolean;
  accountStatus?: TStatus;
  isSubscribed?: boolean;
  lastOTP?: string;
  isVerified?: boolean;
  profile_type: TProfileType;
  authType?: "GOOGLE" | "CUSTOM";

  // for subscription
  planId?: Types.ObjectId | null;
  isSubscriptionActive?: boolean;
  aiCredit?: number;

  // for content filtering
  finishedMcqBankIds?: Types.ObjectId[];
  finishedFlashcardIds?: Types.ObjectId[];
  finishedClinicalCaseIds?: Types.ObjectId[];
  finishedOsceIds?: Types.ObjectId[];

  dailyChallengeContentId?: Types.ObjectId;
  dailyChallengeContentLastUpdated?: Date;
  isDailyChallengeCompleted?: boolean;
};

export type TRegisterPayload = {
  firstName: string;   
  lastName: string;  
  email: string;
  password: string;
  phone?: string;
  studentType?: string;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TJwtUser = {
  email: string;
  role?: "USER" | "ADMIN";
};
