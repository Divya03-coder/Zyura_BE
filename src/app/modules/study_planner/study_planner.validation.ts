import { z } from "zod";

const create = z.object({
  plan_summary: z.string(),
  total_days: z.number(),
  daily_plan: z.array(
    z.object({
      day_number: z.number(),
      date: z.string(), // if you want: z.string().datetime()
      total_hours: z.number(),
      topics: z.array(z.string()),
      hourly_breakdown: z.array(
        z.object({
          task_type: z.string(),
          description: z.string(),
          duration_hours: z.number().optional(),
          duration_minutes: z.number().optional(),
          suggest_content: z.object({
            contentId: z.string(),
            limit: z.number(),
          }),
        }),
      ),
    }),
  ),
});

export const study_planner_validations = { create };
