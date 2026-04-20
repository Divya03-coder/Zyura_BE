import { z } from "zod";

const create = z.object({
    category: z.string(),
    question: z.string(),
    answer: z.string(),
});

const update = z.object({
    category: z.string().optional(),
    question: z.string().optional(),
    answer: z.string().optional(),
});

export const faq_validations = { create,update };
