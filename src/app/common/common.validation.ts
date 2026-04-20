import { z } from "zod";

export const commonPreferenceValidationSchema = z.object({
  subject: z.string().optional(),
  systemPreference: z.string().optional(),
  topic: z.string().optional(),
  subTopic: z.string().optional(),
});

