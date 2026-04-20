import { Types } from "mongoose";

export type T_Payment = {
  accountId: Types.ObjectId;
  planId: Types.ObjectId;
  paymentId: string;
  sessionId: string;
  successIndicator: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  checkoutMode: string;
};
