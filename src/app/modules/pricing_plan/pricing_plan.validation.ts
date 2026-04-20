import { z } from "zod";

const create = z.object({
    planName: z.string().min(1, "Plan name is required"),
    price: z.number().min(0, "Price must be a positive number"),
    description: z.string().min(1, "Description is required"),
    billingCycle: z.enum(["Monthly", "Yearly"]),
    userType: z.string().min(1, "User type is required"),
    planFeatures: z
        .array(
            z.object({
                featureName: z.string().min(1, "Feature name is required"),
                featureLimit: z.string().min(1, "Feature limit is required"),
            })
        )
        .min(1, "At least one plan feature is required"),
});
const update = z.object({
    planName: z.string().optional(),
    price: z.number().optional(),
    description: z.string().optional(),
    billingCycle: z.enum(["Monthly", "Yearly"]).optional(),
    userType: z.string().optional(),
    planFeatures: z
        .array(
            z.object({
                featureName: z.string().optional(),
                featureLimit: z.string().optional(),
            })
        )
        .optional(),
});

export const pricing_plan_validations = {
    create,
    update
};
