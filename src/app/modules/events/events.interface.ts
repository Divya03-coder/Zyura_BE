import { Types } from "mongoose";

export type T_Events = {
  eventTitle: string;
  eventType: string;
  eventFormat: string;
  category: string;
  description: string;
  eventData: string;
  startTime: string;
  eventDuration: string;
  instructor: string;
  eventPrice: number | null;
  meetingDetails: string;
  status: "On-Going" | "Completed" | "Up-Coming";
  totalRegistrations: number;
};

export type T_Event_Enrolled = {
  eventId: Types.ObjectId;
  registeredBy: Types.ObjectId;
  paymentId: string;
  sessionId: string;
  successIndicator: string;
  transactionId: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
};
