import { z } from "zod";

const create = z.object({
    groupName: z.string(),
    groupType: z.enum(["public", "private"]),
});


const update = z.object({
    groupName: z.string().optional(),
    groupType: z.enum(["public", "private"]).optional(),
    groupDescription: z.string().optional(),
});

const addMember = z.object({
    members: z.array(z.string()),
});
const removeMember = z.object({
    memberId: z.string(),
});
export const group_validations = { create, update, addMember, removeMember };
