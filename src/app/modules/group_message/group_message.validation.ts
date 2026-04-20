import { z } from "zod";

const create = z.object({
    message: z.string(),
    reply: z.string().optional(),
    groupId: z.string(),
});

export const group_message_validations = { create };
