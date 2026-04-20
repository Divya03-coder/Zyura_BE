import { z } from "zod";

const create = z.object({
  sessionDuration: z.string().optional(),
  sessionValue: z.number().optional(),

  // student or professional info
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),

  // issues
  issue: z.string().optional(),
  mentorAccountId: z.string().optional(),

  // time slot
  date: z.string().optional(),
  time: z.string().optional(),
});
const verify = z.object({
  paymentId: z.string(),
});

export const sessions_validations = { create, verify };
