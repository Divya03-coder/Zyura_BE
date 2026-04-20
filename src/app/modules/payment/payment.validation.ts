import { z } from "zod";

const create = z.object({
  planId: z.string(),
});

export const payment_validations = { create };
