import { z } from "zod";

const create = z.object({
    accountId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profile_photo: z.string().optional(),
    currentRole: z.string().optional(),
    hospitalOrInstitute: z.string().optional(),
    specialty: z.string().optional(),
    professionalExperience: z.number().optional(),
    postgraduateDegree: z.string().optional(),
    country: z.string().optional(),
    isConditionAccepted: z.boolean().optional(),
    bio: z.string().optional(),
});



const availabilitySchema = z.object({
    day: z.string().min(1, "Day is required"),
    time: z.array(z.string()).min(1, "Time is required"),
});

const verify_profession = z.object({
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    hourlyRate: z.number().nonnegative().optional(),
    currency: z.string().min(1).optional(),
    availability: z.array(availabilitySchema).optional(),
});

const update_payment_information = z.object({
    bankInformation: z.object({
        accountHolderName: z.string().min(1, "Account holder name is required"),
        bankName: z.string().min(1, "Bank name is required"),
        accountNumber: z.string().min(1, "Account number is required"),
        routingNumber: z.string().min(1, "Routing number is required"),
        accountType: z.string().min(1, "Account type is required"),
    }).optional(),
});

export const mentor_validations = { create, verify_profession, update_payment_information };
