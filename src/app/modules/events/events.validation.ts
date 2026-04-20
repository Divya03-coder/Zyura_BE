import { z } from "zod";

const create = z.object({
  eventTitle: z.string().min(1, "Event title is required"),
  eventType: z.string().min(1, "Event type is required"),
  eventFormat: z.string().min(1, "Event format is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  eventData: z.string().min(1, "Event data is required"),
  startTime: z.string().min(1, "Start time is required"),
  eventDuration: z.string().min(1, "Event duration is required"),
  instructor: z.string().min(1, "Instructor is required"),
  eventPrice: z.number().nullable().optional(),
  meetingDetails: z.string().min(1, "Meeting details are required"),
});
const update = z.object({
  eventTitle: z.string().optional(),
  eventType: z.string().optional(),
  eventFormat: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  eventData: z.string().optional(),
  startTime: z.string().optional(),
  eventDuration: z.string().optional(),
  instructor: z.string().optional(),
  eventPrice: z.number().optional(),
  meetingDetails: z.string().optional(),
  status: z.enum(["On-Going", "Completed", "Up-Coming"]).optional(),
  totalRegistrations: z.number().optional(),
});

const eventEnrolledZodSchema = z.object({
  eventId: z.string().optional(),
  registeredBy: z.string().optional(),

  paymentId: z.string().optional(),
  sessionId: z.string().optional(),
  successIndicator: z.string().optional(),
  transactionId: z.string().optional(),

  status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional(),
});

export const events_validations = { create, update, eventEnrolledZodSchema };
