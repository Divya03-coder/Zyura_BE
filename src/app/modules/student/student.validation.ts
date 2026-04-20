import { z } from 'zod';

const update = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    country: z.string().optional(),
    university: z.string().optional(),
    preparingFor: z.any().optional(),
    bio: z.string().optional(),
    year_of_study: z.string().optional(),
    profile_photo: z.string().optional(),
});

export const student_validation = {
    update
}