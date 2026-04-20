import { z } from "zod";

const status = z.object({
  status: z.enum(["IN_REVIEW", "RESOLVED", "REJECTED"]),
  note: z.string().optional()
});

export const report_validations = {
  status
};
