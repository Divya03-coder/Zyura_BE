import { Types } from "mongoose";

export type T_Sessions = {
  sessionDuration: string;
  sessionValue: number;
  sessionStatus: "UPCOMING" | "COMPLETED" | "EXPIRED";

  //student or professional info
  firstName: string;
  lastName: string;
  email: string;
  studentAccountId: Types.ObjectId;

  // issues
  issue: string;
  mentorAccountId: Types.ObjectId;

  // time slot
  date: string;
  time: string;

  // order info
  paymentId: string;
  sessionId: string;
  successIndicator: string;
  studentSidePaymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  adminToMentorPaymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  transactionId: string;
};
