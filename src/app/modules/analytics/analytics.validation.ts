import { z } from "zod";

const create = z.object({});
const updateViewCount = z.object({
  contentId: z.string(),
  key: z.string(),
});

export const analytics_validations = { create ,updateViewCount};
