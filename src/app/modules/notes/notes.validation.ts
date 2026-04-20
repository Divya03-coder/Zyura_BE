import { z } from "zod";

const create = z.object({
    title: z.string(),
    description: z.string().optional(),
    subject: z.string(),
    system: z.string(),
    topic: z.string(),
    subtopic: z.string().optional(),
    contentFor: z.enum(["student", "professional"]),
    profileType: z.string(),
});

export const notes_validations = { create };
