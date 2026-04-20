import { z } from "zod";

const create = z.object({
    uploadedBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    profileType: z.enum(["student_profile", "admin_profile", "mentor_profile"]),
    resourceName: z.string().min(1, "Resource name is required"),
    shortDescription: z.string().min(1, "Short description is required"),
    topic: z.array(z.string().min(1, "Topic cannot be empty")).min(1, "At least one topic is required"),
});

export const career_resource_validation = {
    create,
};
