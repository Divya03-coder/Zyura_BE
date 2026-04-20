import { z } from "zod";

const create = z.object({
    platformName: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    platformLogo: z.string().optional(),
    favicon: z.string().optional(),
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    supportEmail: z.string().optional(),
    websiteURL: z.string().optional(),
});

export const web_setting_validations = { create };
