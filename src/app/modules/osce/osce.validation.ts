import { z } from "zod";

const create = z.object({
    name: z.string(),
    description: z.string(),
    scenario: z.string(),
    timeLimit: z.string(),
    candidateInstruction: z.string(),
    patientInstruction: z.string(),

    tasks: z.array(
        z.object({
            taskName: z.string(),
            checklistItem: z.array(z.string())
        })
    ),

    tutorial: z.array(z.string()),

    learningResource: z.object({
        resourceTitle: z.string(),
        resourceUrl: z.string()
    }),

    subject: z.string(),
    system: z.string(),
    topic: z.string(),
    subtopic: z.string().optional(),
    contentFor: z.enum(["student", "professional"]),
    profileType: z.string(),
});
const update = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    scenario: z.string().optional(),
    timeLimit: z.string().optional(),
    candidateInstruction: z.string().optional(),
    patientInstruction: z.string().optional(),

    tasks: z.array(
        z.object({
            taskName: z.string(),
            checklistItem: z.array(z.string())
        })
    ).optional(),

    tutorial: z.array(z.string()).optional(),

    learningResource: z.object({
        resourceTitle: z.string(),
        resourceUrl: z.string()
    }).optional(),

    subject: z.string().optional(),
    system: z.string().optional(),
    topic: z.string().optional(),
    subtopic: z.string().optional(),
    contentFor: z.string().optional(),
    profileType: z.string().optional()
});

export const osce_validations = { create, update };
